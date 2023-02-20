package handlers

import (
	"github.com/gofiber/fiber/v2"
)

func Index(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{"message": "Hello, World!"})
}
