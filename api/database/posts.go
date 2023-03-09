package database

import (
	"context"
	"errors"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/xnacly/private.social/api/models"
)

// inserts a new post into the database, returns the id of the newly created post
func (db Database) InsertNewPost(post models.Post) (primitive.ObjectID, error) {
	res, err := db.posts.InsertOne(context.TODO(), post)
	r := res.InsertedID.(primitive.ObjectID)
	return r, err
}

// find a post by its id
//
// 1. checks if the id is valid, otherwise err (saves a lot of execution time)
//
// 2. checks if the id can be parsed to an ObjectID, otherwise err
//
// 3. searches for the post in the database, not found = err
func (db Database) GetPostById(id string, author_id primitive.ObjectID) (models.Post, error) {
	var post models.Post

	// returning early saves us 45ms, from 45ms down to 0ms
	if !primitive.IsValidObjectID(id) {
		return models.Post{}, errors.New("invalid id")
	}

	obj_id, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return models.Post{}, err
	}

	err = db.posts.FindOne(context.TODO(), bson.M{"_id": obj_id, "author": author_id}).Decode(&post)

	return post, err
}

func (db Database) DoesPostExist(id string) bool {
	// returning early saves us 45ms, from 45ms down to 0ms
	if !primitive.IsValidObjectID(id) {
		return false
	}

	obj_id, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return false
	}

	err = db.posts.FindOne(context.TODO(), bson.M{"_id": obj_id}).Err()
	return err == nil
}

func (db Database) GetAllPostsByUserId(id primitive.ObjectID) ([]models.Post, error) {
	var posts []models.Post

	cursor, err := db.posts.Find(context.TODO(), bson.M{"author": id})

	if err = cursor.All(context.TODO(), &posts); err != nil {
		return []models.Post{}, err
	}

	return posts, nil
}

func (db Database) DeletePostById(id string, author_id primitive.ObjectID) error {
	if !primitive.IsValidObjectID(id) {
		return errors.New("invalid id")
	}

	obj_id, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return errors.New("invalid id")
	}

	res, err := db.posts.DeleteOne(context.TODO(), bson.M{"_id": obj_id, "author": id})
	if err != nil {
		return err
	} else if res.DeletedCount == 0 {
		return errors.New("post not found, therefore not deleted")
	}
	return nil
}
