package util

import (
	"log"
	"time"

	"github.com/xnacly/private.social/api/config"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

const ASCII_ART = `
██████╗ ██████╗ ██╗██╗   ██╗ █████╗ ████████╗███████╗   ███████╗ ██████╗  ██████╗██╗ █████╗ ██╗                    █████╗ ██████╗ ██╗
██╔══██╗██╔══██╗██║██║   ██║██╔══██╗╚══██╔══╝██╔════╝   ██╔════╝██╔═══██╗██╔════╝██║██╔══██╗██║                   ██╔══██╗██╔══██╗██║
██████╔╝██████╔╝██║██║   ██║███████║   ██║   █████╗     ███████╗██║   ██║██║     ██║███████║██║         █████╗    ███████║██████╔╝██║
██╔═══╝ ██╔══██╗██║╚██╗ ██╔╝██╔══██║   ██║   ██╔══╝     ╚════██║██║   ██║██║     ██║██╔══██║██║         ╚════╝    ██╔══██║██╔═══╝ ██║
██║     ██║  ██║██║ ╚████╔╝ ██║  ██║   ██║   ███████╗██╗███████║╚██████╔╝╚██████╗██║██║  ██║███████╗              ██║  ██║██║     ██║
╚═╝     ╚═╝  ╚═╝╚═╝  ╚═══╝  ╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝╚══════╝ ╚═════╝  ╚═════╝╚═╝╚═╝  ╚═╝╚══════╝              ╚═╝  ╚═╝╚═╝     ╚═╝
`

// copied from https://github.com/xNaCly/private.social/blob/master/cdn/util/util.go
// hold error feedback for the client response, allows for converting data to json
type ApiError struct {
	Success bool   `json:"success"` // indicate if the request was successful or not
	Code    int    `json:"code"`    // HTTP status code: 200, 400, 500, etc
	Message string `json:"message"` // error text associated with the error
}

// debug logging, only prints if the PROD environment variable is set to false
func DLog(msg string) {
	if config.Config["PROD"] == "false" {
		log.Println("[DEBUG]:", msg)
	}
}

func GetTimeStamp() primitive.DateTime {
	return primitive.NewDateTimeFromTime(time.Now())
}
