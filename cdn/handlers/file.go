package handlers

import (
	"github.com/gofiber/fiber/v2"
	"log"
)

func Index(c *fiber.Ctx) error {
	log.Println("route:", c.Path(), "from:", c.IP())
	return c.JSON(fiber.Map{"message": "Hello, World!"})
}

func AcceptIncomingFile(c *fiber.Ctx) error {
	return nil
}

func SendFile(c *fiber.Ctx) error {
	return nil
}
