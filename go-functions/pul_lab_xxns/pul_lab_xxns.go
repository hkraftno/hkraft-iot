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
	} else if !(strings.HasPrefix(parts[1], "02") || strings.HasPrefix(parts[1], "07")) {
		http.Error(w, "This parser only supports the Uplink message DATALOG - FPort 3 (HEX starts with 02 or 07)", 400)
		return
	}

	hexBytes, err := hex.DecodeString(parts[1])
	if err != nil {
		http.Error(w, err.Error(), 400)
		return
	}
	var data pulLabxxnsStruct
	data.parse(hexBytes)
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	j, _ := json.Marshal(data)
	fmt.Fprintf(w, "%s", j)
}

type pulLabxxnsStruct struct {
	ID            uint8   `json:"id"`
	WireCutStatus *bool   `json:"wire_cut_status"`
	BatteryLevel  float32 `json:"battery_level"`
	InternalData  string  `json:"internal_data"`
	Counter       uint32  `json:"counter"`
}

func (t *pulLabxxnsStruct) parse(payload []byte) {
	length := len(payload)
	t.ID = uint8(payload[0])
	batterByteAddress := 1

	if t.ID == 7 {
		batterByteAddress = 2
		wirecut := payload[1]&0x80 > 0
		t.WireCutStatus = &wirecut
	}
	// battery level expressed in 1/254 %
	t.BatteryLevel = float32(payload[batterByteAddress]) / 254.0 * 100
	for _, b := range payload[2 : length-4] {
		t.InternalData += fmt.Sprintf("%02x", b)
	}
	// detection number as a 4 bytes unsigned int
	t.Counter = bytesToUint32(payload[length-4 : length])
}

func bytesToUint32(byteList []byte) (output uint32) {
	if len(byteList) > 4 {
		panic("Tried to convert byte array greater than 4 to int")
	}
	for _, b := range byteList {
		output = (output << 8) | uint32(b)
	}
	return output
}
