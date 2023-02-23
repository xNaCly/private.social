package util

import (
	"time"

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
type ApiResponse struct {
	Success bool      `json:"success"` // indicate if the request was successful or not
	Code    int       `json:"code"`    // HTTP status code: 200, 400, 500, etc
	Message string    `json:"message"` // error text associated with the error
	Data    fiber.Map `json:"data"`    // additional data to send to the client
}

func GetTimeStamp() primitive.DateTime {
	return primitive.NewDateTimeFromTime(time.Now())
}
