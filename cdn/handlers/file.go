package handlers

import (
	"net/http"
	"os"
	"path/filepath"

	"github.com/gofiber/fiber/v2"
	"github.com/xnacly/private.social/cdn/util"
)

// accepts incoming request and saves the file to the filesystem if everything is ok
func AcceptIncomingFile(c *fiber.Ctx) error {
	// TODO: crop image to 1:1
	// TODO: resize to 1024x1024
	file := c.Params("file")

	if len(file) == 0 {
		fiber.NewError(fiber.StatusBadRequest, "file name request param is empty")
	}

	body := c.Body()

	mimeType := http.DetectContentType(body)
	if _, ok := util.SUPPORTED_FORMATS[mimeType]; !ok {
		return fiber.NewError(fiber.StatusBadRequest, "unsupported file format, choose one of: "+util.SUPPORTED_FORMATS_STR)
	}

	if len(body) == 0 {
		return fiber.NewError(fiber.StatusBadRequest, "request body is empty")
	}

	fileFolder := util.RandomString(32) + "/"
	file = util.EncodeFileName(filepath.Base(file))
	pathToFile := fileFolder + file

	err := os.Mkdir("./vfs/"+fileFolder, 0777)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "couldn't create folder: '"+err.Error()+"'")
	}
	f, err := os.Create("./vfs/" + pathToFile)

	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "couldn't open file: '"+err.Error()+"'")
	}

	defer f.Close()
	_, err = f.Write(body)

	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "couldn't save file: '"+err.Error()+"'")
	}

	return c.Status(fiber.StatusCreated).JSON(util.ApiResponse{
		Code:    fiber.StatusCreated,
		Message: "file uploaded successfully",
		Success: true,
		Data: fiber.Map{
			"path": "/v1/asset/" + pathToFile,
		},
	})
}
