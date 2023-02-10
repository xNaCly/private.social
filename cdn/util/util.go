package util

import (
	"math/rand"
	"os"
	"time"
)

// font: ansi shadow
const ASCII_ART = `
██████╗ ██████╗ ██╗██╗   ██╗ █████╗ ████████╗███████╗   ███████╗ ██████╗  ██████╗██╗ █████╗ ██╗                    ██████╗██████╗ ███╗   ██╗
██╔══██╗██╔══██╗██║██║   ██║██╔══██╗╚══██╔══╝██╔════╝   ██╔════╝██╔═══██╗██╔════╝██║██╔══██╗██║                   ██╔════╝██╔══██╗████╗  ██║
██████╔╝██████╔╝██║██║   ██║███████║   ██║   █████╗     ███████╗██║   ██║██║     ██║███████║██║         █████╗    ██║     ██║  ██║██╔██╗ ██║
██╔═══╝ ██╔══██╗██║╚██╗ ██╔╝██╔══██║   ██║   ██╔══╝     ╚════██║██║   ██║██║     ██║██╔══██║██║         ╚════╝    ██║     ██║  ██║██║╚██╗██║
██║     ██║  ██║██║ ╚████╔╝ ██║  ██║   ██║   ███████╗██╗███████║╚██████╔╝╚██████╗██║██║  ██║███████╗              ╚██████╗██████╔╝██║ ╚████║
╚═╝     ╚═╝  ╚═╝╚═╝  ╚═══╝  ╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝╚══════╝ ╚═════╝  ╚═════╝╚═╝╚═╝  ╚═╝╚══════╝               ╚═════╝╚═════╝ ╚═╝  ╚═══╝
`

const LETTERS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

var SUPPORTED_FORMATS = map[string]struct{}{
	"image/png":  {},
	"image/jpg":  {},
	"image/jpeg": {},
	"image/gif":  {},
	"image/webp": {},
	"image/heic": {}, // TODO: convert to displayable format, heic cant be rendered by common browsers
	"video/mp4":  {},
}

func RandomString(length int) string {
	rand.Seed(time.Now().UnixNano())
	b := make([]byte, length)
	for i := range b {
		b[i] = LETTERS[rand.Intn(len(LETTERS))]
	}
	return string(b)
}

func CreateVfsIfNotFound() {
	if _, err := os.Stat("./vfs"); os.IsNotExist(err) {
		os.Mkdir("./vfs", 0777)
	}
}

type ApiError struct {
	Success bool   `json:"success"`
	Code    int    `json:"code"`
	Message string `json:"message"`
}
