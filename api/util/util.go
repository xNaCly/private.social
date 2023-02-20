package util

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
