package main

import (
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
)

func get(url string, headers map[string]string) (responseBody []byte, err error) {
	return makeRequest("GET", url, headers, nil)
}

func post(url string, headers map[string]string, requestBody io.Reader) (responseBody []byte, err error) {
	return makeRequest("POST", url, headers, requestBody)
}

func makeRequest(method, url string, headers map[string]string, requestBody io.Reader) (responseBody []byte, err error) {
	req, err := http.NewRequest(method, url, requestBody)
	if err != nil {
		return nil, err
	}
	for key, value := range headers {
		req.Header.Set(key, value)
	}
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	responseBody, err = ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	} else if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("got non 200 status code %d on url %s, body:\n%s", resp.StatusCode, url, responseBody)
	}
	return responseBody, nil
}
