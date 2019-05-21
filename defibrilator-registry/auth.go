package main

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"time"
)

const (
	authURL       = apiURL + "/oauth/token"
	expiresBuffer = 60 // seconds
)

var _token *TokenStruct

// Authenticate gets a cachec token from 113.no if it hasen't expired yet
func Authenticate(clientID, clientSecret string) (token TokenStruct, err error) {
	if _token != nil && isTokenStillValid(_token) {
		return *_token, nil
	}
	headers := map[string]string{
		"Content-Type":  "application/x-www-form-urlencoded",
		"Authorization": "Basic " + base64.StdEncoding.EncodeToString([]byte(clientID+":"+clientSecret)),
	}
	body, err := post(authURL, headers, bytes.NewBuffer([]byte("grant_type=client_credentials")))
	if err != nil {
		return
	}
	err = json.Unmarshal(body, &token)
	token.TimeStamp = time.Now()
	_token = &token
	return
}

func isTokenStillValid(token *TokenStruct) bool {
	return time.Since(token.TimeStamp).Seconds() < float64(token.ExpiresIn-expiresBuffer)
}

// TokenStruct is used to store token from 113.no
type TokenStruct struct {
	AccessToken string    `json:"access_token"`
	TokenType   string    `json:"token_type"`
	ExpiresIn   int       `json:"expires_in"`
	TimeStamp   time.Time `json:"timeStamp"`
}
