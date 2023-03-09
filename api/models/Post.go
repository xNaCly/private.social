package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type CreatePost struct {
	Url         string `bson:"url" json:"url"`
	Description string `bson:"description" json:"description"`
}

type Post struct {
	Id            primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Url           string             `bson:"url" json:"url"`
	Description   string             `bson:"description" json:"description"`
	CreatedAt     primitive.DateTime `bson:"created_at" json:"created_at"`
	LikeAmount    int                `bson:"like_amount" json:"like_amount"`
	CommentAmount int                `bson:"comment_amount" json:"comment_amount"`
	Author        primitive.ObjectID `bson:"author" json:"author"`
}
