package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
)

const (
	apiURL = "https://www.113.no/ords/api"
)

var (
	clientID     = os.Getenv("CLIENT_ID")
	clientSecret = os.Getenv("CLIENT_SECRET")
)

func getDefibrilators(w http.ResponseWriter, r *http.Request) {
	fmt.Println(clientID, clientSecret)
	token, err := Authenticate(clientID, clientSecret)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	centerLatitude, err := getfloat64QueryParam(r.URL.Query(), "center-latitude")
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	centerLongitude, err := getfloat64QueryParam(r.URL.Query(), "center-longitude")
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	radius, err := getIntQueryParam(r.URL.Query(), "radius-in-meters")
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	searchURL := fmt.Sprintf(
		apiURL+"/v1/assets/search/?latitude=%f&longitude=%f&distance=%d",
		centerLatitude,
		centerLongitude,
		radius,
	)
	body, err := get(searchURL, map[string]string{
		"Authorization": "Bearer " + token.AccessToken,
	})
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	w.Header().Add("Content-Type", "application/json")
	fmt.Fprintf(w, "%s", body)
}

func main() {
	http.HandleFunc("/", getDefibrilators)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Println("Serving http://localhost:" + port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}

func getIntQueryParam(query map[string][]string, key string) (value int, err error) {
	stringValue, err := getQueryParam(query, key)
	if err != nil {
		return 0, fmt.Errorf("%s needs to be a number (int), was %s, got this error %v", key, stringValue, err)
	}
	return strconv.Atoi(stringValue)
}

func getfloat64QueryParam(query map[string][]string, key string) (value float64, err error) {
	stringValue, err := getQueryParam(query, key)
	if err != nil {
		return 0, fmt.Errorf("%s needs to be a number (float), i.e. 59.123 but it was %s, got this error %v", key, stringValue, err)
	}
	return strconv.ParseFloat(stringValue, 64)
}

func getQueryParam(query map[string][]string, key string) (value string, err error) {
	if values, ok := query[key]; ok {
		if len(values) > 1 {
			return "", fmt.Errorf("max one instance of %s in url", key)
		} else if values[0] == "" {
			return "", fmt.Errorf("%s needs to have a coordinate as value", key)
		}
		return values[0], nil
	}
	return "", fmt.Errorf("%s is a required url parameter", key)
}
