package router

import (
	"github.com/gofiber/fiber/v2"
	"log"
)

// struct representing a route the api should handle and register
type Route struct {
	Path        string                   // path, examples: "/", "/user/:id"
	Method      string                   // method, index is "GET", "POST", "PUT", "DELETE"
	Handler     func(*fiber.Ctx) error   // handler function, example: func(c *fiber.Ctx) error { return c.SendString("Hello, World!") }
	Middlewares []func(*fiber.Ctx) error // middlewares, such as authentication, rate limiting or logging
}

// registers all router.Route structs in the routes to the app grouped by the groupPrefix
func RegisterRoutes(app *fiber.App, groupPrefix string, routes ...Route) {
	group := app.Group(groupPrefix)
	for _, route := range routes {
		group.Add(route.Method, route.Path, append(route.Middlewares, route.Handler)...)
		log.Printf("Registered route: [%s] %s%s\n", route.Method, groupPrefix, route.Path)
	}
}
