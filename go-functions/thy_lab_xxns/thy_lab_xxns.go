package gofunctions

import (
	"encoding/hex"
	"encoding/json"
	"fmt"
	"math"
	"net/http"
	"strings"
)

// Parse is the cloud function for converting the payload hex to json
func Parse(w http.ResponseWriter, r *http.Request) {
	parts := strings.SplitN(r.URL.String(), "/", 2)
	if r.Method != "GET" {
		http.Error(w, "Only GET is supported", 405)
		return
	} else if len(parts) != 2 || parts[1] == "" {
		http.Error(w, "Expected HEX to come after /", 400)
		return
	} else if !strings.HasPrefix(parts[1], "03") {
		http.Error(w, "This parser only supports the Uplink message DATALOG - FPort 3 (HEX starts with 03)", 400)
		return
	}

	hexBytes, err := hex.DecodeString(parts[1])
	if err != nil {
		http.Error(w, err.Error(), 400)
		return
	}
	var data thyLabxxnsStruct
	data.parse(hexBytes)
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	j, _ := json.Marshal(data)
	fmt.Fprintf(w, "%s", j)
}

type thyLabxxnsStruct struct {
	ID           uint8   `json:"id"`
	BatteryLevel uint8   `json:"battery_level"`
	InternalData string  `json:"internal_data"`
	Temperature  float32 `json:"temperature"`
	Humidity     uint8   `json:"humidity"`
}

func (t *thyLabxxnsStruct) parse(payload []byte) {
	length := len(payload)
	t.ID = uint8(payload[0])
	// battery level expressed in 1/254 %
	t.BatteryLevel = uint8(math.Round(float64(payload[1]) / 254.0 * 100))
	for _, b := range payload[2 : length-3] {
		t.InternalData += fmt.Sprintf("%02x", b)
	}
	msb := int16(payload[length-3])
	lsb := int16(payload[length-2])
	// temperature expressed in 1/16 °C as a 2 bytes signed int
	t.Temperature = float32((msb<<8)|lsb) / 16
	t.Humidity = uint8(payload[length-1])
}
