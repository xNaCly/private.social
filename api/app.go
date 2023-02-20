package main

import (
	"errors"
	"fmt"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"

	"github.com/xnacly/private.social/api/handlers"
	"github.com/xnacly/private.social/api/util"
)

func main() {
	log.SetFlags(log.Ldate | log.Ltime)
	fmt.Print(util.ASCII_ART)

	var DefaultErrorHandler = func(c *fiber.Ctx, err error) error {
		code := fiber.StatusInternalServerError

		var e *fiber.Error
		if errors.As(err, &e) {
			code = e.Code
		}

		apiErr := util.ApiError{
			Code:    code,
			Message: err.Error(),
			Success: false,
		}

		return c.Status(code).JSON(apiErr)
	}

	app := fiber.New(fiber.Config{
		AppName:      "private.social/api",
		ServerHeader: "private.social/api",
		ErrorHandler: DefaultErrorHandler,
	})

	app.Use(logger.New(logger.Config{
		TimeFormat: "2006-01-02 15:04:05",
	}))

	app.Use(cors.New())

	v1 := app.Group("/v1")
	v1.Get("/", handlers.Index)

	app.Use(func(c *fiber.Ctx) error {
		return c.Status(404).JSON(util.ApiError{
			Code:    fiber.ErrNotFound.Code,
			Message: fiber.ErrNotFound.Message,
			Success: false,
		})
	})

	log.Fatal(app.Listen(":8000"))
}
