package main

import (
	"log"
	"net/http"
	"os"
)

const (
	publicDirPath = "public/"
	defaultPort   = "8080"
)

func main() {
	http.Handle("/", http.FileServer(http.Dir(publicDirPath)))
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	log.Printf("Serving %s on http://localhost:%s\n", publicDirPath, port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
