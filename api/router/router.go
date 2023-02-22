package router

import (
	"github.com/gofiber/fiber/v2"
	"log"
)

type Route struct {
	Path        string
	Method      string
	Handler     func(*fiber.Ctx) error
	Middlewares []func(*fiber.Ctx) error
}


// registers all routes 
func RegisterRoutes(app *fiber.App, groupPrefix string, routes ...Route){
	group := app.Group(groupPrefix)
	for _, route := range routes {
		group.Add(route.Method, route.Path, append(route.Middlewares, route.Handler)...)
		log.Printf("Registered route: [%s] %s%s\n", route.Method,groupPrefix, route.Path)
	}
}
