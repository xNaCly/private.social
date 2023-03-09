package handlers

import (
	"github.com/xnacly/private.social/api/util"

	"github.com/gofiber/fiber/v2"
)

// PingHandler is a simple handler to test if the server is running
func Ping(c *fiber.Ctx) error {
	return c.JSON(util.ApiResponse{
		Success: true,
		Message: "pong",
		Code:    200,
		Data:    nil,
	})
}
