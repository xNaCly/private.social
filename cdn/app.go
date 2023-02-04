package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/xnacly/private.social/cdn/handlers"
	"log"
)

func main() {
	log.SetFlags(log.Ldate | log.Ltime)
	app := fiber.New(fiber.Config{})

	v1 := app.Group("/v1")
	v1.Get("/", handlers.Index)

	log.Fatal(app.Listen(":3000"))
}
