package handlers

import (
	"github.com/xnacly/private.social/api/database"
	"github.com/xnacly/private.social/api/models"
	"github.com/xnacly/private.social/api/util"

	"github.com/gofiber/fiber/v2"
)

func GetMe(c *fiber.Ctx) error {
	user := c.Locals("dbUser").(models.User)
	return c.JSON(util.ApiResponse{
		Code:    fiber.StatusOK,
		Message: "requested user found",
		Success: true,
		Data:    fiber.Map{"user": user},
	})

}

func GetUserById(c *fiber.Ctx) error {
	id := c.Params("id")

	if len(id) == 0 {
		return c.Status(400).JSON(util.ApiResponse{
			Code:    fiber.ErrBadRequest.Code,
			Message: "id path param is empty",
			Success: false,
		})
	}

	loggedInUser := c.Locals("dbUser").(models.User)

	if id == loggedInUser.Id.String() {
		return c.JSON(util.ApiResponse{
			Code:    fiber.StatusOK,
			Message: "requested user found",
			Success: true,
			Data:    fiber.Map{"user": loggedInUser},
		})
	}

	user, err := database.Db.GetUserById(id)

	if user.Private {
		if !util.ObjectIdsMatch(loggedInUser.Id, user.Id) && !database.Db.IsIdInUsersFollowing(user.Id, loggedInUser.Id) {
			return c.Status(403).JSON(util.ApiResponse{
				Code:    fiber.ErrForbidden.Code,
				Message: "You are not allowed to view this user",
				Success: false,
			})
		}
	}

	if err != nil {
		return c.Status(404).JSON(util.ApiResponse{
			Code:    fiber.ErrNotFound.Code,
			Message: err.Error(),
			Success: false,
		})
	}

	return c.JSON(util.ApiResponse{
		Code:    fiber.StatusOK,
		Message: "requested user found",
		Success: true,
		Data:    fiber.Map{"user": user},
	})
}

func UpdateMe(c *fiber.Ctx) error {
	if len(c.Body()) == 0 {
		return c.Status(400).JSON(util.ApiResponse{
			Code:    fiber.ErrBadRequest.Code,
			Message: "request body is empty",
			Success: false,
		})
	}

	body := models.UpdateUser{}

	if err := c.BodyParser(&body); err != nil {
		return c.Status(400).JSON(util.ApiResponse{
			Code:    fiber.ErrBadRequest.Code,
			Message: err.Error(),
			Success: false,
		})
	}

	user := c.Locals("dbUser").(models.User)

	// body.Private is always false if not specified in the req body
	// therefore we only change this flage if it is different from the flag from the database
	if body.Private != user.Private {
		body.Private = user.Private
	}

	if 0 < len(body.DisplayName) && len(body.DisplayName) < 5 {
		return c.Status(400).JSON(util.ApiResponse{
			Code:    fiber.ErrBadRequest.Code,
			Message: "display name must be at least 5 characters long",
			Success: false,
		})
	}

	database.Db.UpdateUserById(user.Id, body)

	return c.JSON(util.ApiResponse{
		Code:    fiber.StatusOK,
		Message: "requested user updated",
		Success: true,
	})
}
