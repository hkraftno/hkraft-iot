package gofunctions

import (
	"encoding/hex"
	"encoding/json"
	"fmt"
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
	} else if !strings.HasPrefix(parts[1], "05") {
		http.Error(w, "This parser only supports the Uplink message DATALOG - FPort 3 (HEX starts with 05)", 400)
		return
	}

	hexBytes, err := hex.DecodeString(parts[1])
	if err != nil {
		http.Error(w, err.Error(), 400)
		return
	}
	var data torLabxxnsStruct
	data.parse(hexBytes)
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	j, _ := json.Marshal(data)
	fmt.Fprintf(w, "%s", j)
}

type torLabxxnsStruct struct {
	ID           uint8   `json:"id"`
	BatteryLevel float32 `json:"battery_level"`
	OpenState    bool    `json:"open_state"`
	InternalData string  `json:"internal_data"`
}

func (t *torLabxxnsStruct) parse(payload []byte) {
	t.ID = uint8(payload[0])
	// battery level expressed in 1/254 %
	t.BatteryLevel = float32(payload[1]) / 254.0 * 100
	t.OpenState = payload[2]&0x80 > 0
	for _, b := range payload[3:] {
		t.InternalData += fmt.Sprintf("%02x", b)
	}
}
