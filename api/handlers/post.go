package handlers

import (
	"github.com/xnacly/private.social/api/database"
	"github.com/xnacly/private.social/api/models"
	"github.com/xnacly/private.social/api/util"

	"github.com/gofiber/fiber/v2"
	"sort"
)

func CreatePost(c *fiber.Ctx) error {
	incomingPost := new(models.CreatePost)

	if err := c.BodyParser(incomingPost); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid post data")
	}

	if len(incomingPost.Url) == 0 {
		return fiber.NewError(fiber.StatusBadRequest, "Url is required")
	} else if len(incomingPost.Description) == 0 {
		return fiber.NewError(fiber.StatusBadRequest, "Description is required")
	}

	user := c.Locals("dbUser").(models.User)
	post := models.Post{
		Url:           incomingPost.Url,
		Description:   incomingPost.Description,
		Author:        user.Id,
		CreatedAt:     util.GetTimeStamp(),
		LikeAmount:    0,
		CommentAmount: 0,
	}

	postid, err := database.Db.InsertNewPost(post)

	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Something went wrong while creating the post")
	}

	return c.Status(fiber.StatusCreated).JSON(util.ApiResponse{
		Code:    fiber.StatusCreated,
		Success: true,
		Data:    fiber.Map{"post_id": postid},
		Message: "Post created successfully",
	})
}

func GetPosts(c *fiber.Ctx) error {
	user := c.Locals("dbUser").(models.User)
	posts, err := database.Db.GetAllPostsByUserId(user.Id)

	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Something went wrong while fetching the posts")
	}

	// ISSUE: time.Compare is not working as expected in the docker image as well as in the workflow env
	// documentation says its in go 1.20 but even after updating the go version in the docker image it still doesn't work
	// go changelogs: https://tip.golang.org/doc/go1.20#time
	// INFO: switched from posts[a].CreatedAt.Time().Compare(posts[b].CreatedAt.Time()) to posts[a].CreatedAt.Time().Unix() > posts[b].CreatedAt.Time().Unix()
	sort.Slice(posts, func(a, b int) bool {
		return posts[a].CreatedAt.Time().Unix() > posts[b].CreatedAt.Time().Unix()
	})

	return c.Status(fiber.StatusOK).JSON(util.ApiResponse{
		Code:    fiber.StatusOK,
		Success: true,
		Data:    fiber.Map{"posts": posts},
		Message: "Posts fetched successfully",
	})
}

// currently a user can only view his own posts :skull:
func GetPostById(c *fiber.Ctx) error {
	postid := c.Params("id")
	if len(postid) == 0 {
		return fiber.NewError(fiber.StatusBadRequest, "Post id is required")
	}

	user := c.Locals("dbUser").(models.User)
	post, err := database.Db.GetPostById(postid, user.Id)

	if err != nil {
		return fiber.NewError(fiber.StatusNotFound, "Post not found")
	}

	return c.Status(fiber.StatusOK).JSON(util.ApiResponse{
		Code:    fiber.StatusOK,
		Success: true,
		Data:    fiber.Map{"post": post},
		Message: "Post fetched successfully",
	})
}

func DeletePost(c *fiber.Ctx) error {
	user := c.Locals("dbUser").(models.User)
	postid := c.Params("id")

	if len(postid) == 0 {
		return fiber.NewError(fiber.StatusBadRequest, "Post id is required")
	}

	if !database.Db.DoesPostExist(postid) {
		return fiber.NewError(fiber.StatusNotFound, "Post not found")
	}

	err := database.Db.DeletePostById(postid, user.Id)

	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Something went wrong while deleting the post")
	}

	return c.JSON(util.ApiResponse{
		Success: true,
		Code:    fiber.StatusOK,
		Message: "Post deleted successfully",
	})
}
