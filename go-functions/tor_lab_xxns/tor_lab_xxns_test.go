package gofunctions

import (
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestID(t *testing.T) {
	var expected uint8 = 3
	var data torLabxxnsStruct
	data.parse([]byte{0x03, 0x00, 0x00, 0x00, 0x00, 0x00})
	actual := data.ID
	if expected != actual {
		t.Errorf(
			"Expected ID to be %d but was %d",
			expected,
			actual,
		)
	}
}

func TestBattery(t *testing.T) {
	var expected float32 = 253.0 / 254.0 * 100 // 99%
	var data torLabxxnsStruct
	data.parse([]byte{0x00, 0xfd, 0x00, 0x00, 0x00, 0x00})
	actual := data.BatteryLevel
	if expected != actual {
		t.Errorf(
			"Expected BatteryLevel to be %f but was %f",
			expected,
			actual,
		)
	}
}

func TestInternalData(t *testing.T) {
	expected := "01020304050607"
	var data torLabxxnsStruct
	data.parse([]byte{0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07})
	actual := data.InternalData
	if actual != expected {
		t.Errorf(
			"Expected InternalData to be %s but was %s",
			expected,
			actual,
		)
	}
}

func TestOpenStateTrue(t *testing.T) {
	var expected bool = true
	var data torLabxxnsStruct
	data.parse([]byte{0x00, 0x00, 0x83})
	actual := data.OpenState
	if expected != actual {
		t.Errorf(
			"Expected OpenState to be %t but was %t",
			expected,
			actual,
		)
	}
}

func TestOpenStateFalse(t *testing.T) {
	var expected bool = false
	var data torLabxxnsStruct
	data.parse([]byte{0x00, 0x00, 0x03})
	actual := data.OpenState
	if expected != actual {
		t.Errorf(
			"Expected OpenState to be %t but was %t",
			expected,
			actual,
		)
	}
}

func TestInvalidHTTPMethod(t *testing.T) {
	r, _ := http.NewRequest("POST", "/03fd8e019c10001b", nil)
	w := httptest.NewRecorder()

	Parse(w, r)
	result := w.Result()
	if result.StatusCode == 200 {
		t.Errorf("Expected status code to be != 200 when not using GET")
	}
	body, err := ioutil.ReadAll(result.Body)
	if len(body) == 0 || err != nil {
		t.Errorf("Expected body to contain error was %+q %s", body, err)
	}
}

func TestInvalidHex(t *testing.T) {
	r, _ := http.NewRequest("GET", "/03fd8e019c10001b6", nil)
	w := httptest.NewRecorder()

	Parse(w, r)
	result := w.Result()
	if result.StatusCode == 200 {
		t.Errorf("Expected status code to be != 200 when not using valid HEX")
	}
	body, err := ioutil.ReadAll(result.Body)

	if len(body) == 0 || err != nil {
		t.Errorf("Expected body to contain error was %+q %s", body, err)
	}
}

func TestInvalidURL(t *testing.T) {
	r, _ := http.NewRequest("GET", "not-valid", nil)
	w := httptest.NewRecorder()

	Parse(w, r)
	result := w.Result()
	if result.StatusCode == 200 {
		t.Errorf("Expected status code to be != 200 when not using valid URL")
	}
	body, err := ioutil.ReadAll(result.Body)

	if len(body) == 0 || err != nil {
		t.Errorf("Expected body to contain error was %+q %s", body, err)
	}
}

func TestInvalidMessageFormat(t *testing.T) {
	r, _ := http.NewRequest("GET", "/09", nil)
	w := httptest.NewRecorder()

	Parse(w, r)
	result := w.Result()
	if result.StatusCode == 200 {
		t.Errorf("Expected status code to be != 200 when not using valid URL")
	}
	body, err := ioutil.ReadAll(result.Body)

	if len(body) == 0 || err != nil {
		t.Errorf("Expected body to contain error was %+q %s", body, err)
	}
}

func TestParserExampleHex1(t *testing.T) {
	r, _ := http.NewRequest("GET", "/03fd808e019c10", nil)
	w := httptest.NewRecorder()

	Parse(w, r)
	result := w.Result()
	body, _ := ioutil.ReadAll(result.Body)
	var expected = `{"id":3,"battery_level":99.6063,"open_state":true,"internal_data":"8e019c10"}`
	if expected != string(body) {
		t.Errorf(
			"Expected JSON to be\n%s\nbut was\n%s",
			expected,
			body,
		)
	}
}
