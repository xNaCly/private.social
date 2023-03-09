package database

import (
	"context"
	"errors"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/xnacly/private.social/api/models"
)

// inserts a new user into the database, returns the id of the newly created user
func (db Database) InsertNewUser(user models.User) (primitive.ObjectID, error) {
	res, err := db.users.InsertOne(context.TODO(), user)
	r := res.InsertedID.(primitive.ObjectID)
	return r, err
}

// find a user by their id
//
// 1. checks if the id is valid, otherwise err (saves a lot of execution time)
//
// 2. checks if the id can be parsed to an ObjectID, otherwise err
//
// 3. searches for the user in the database, not found = err
func (db Database) GetUserById(id string) (models.User, error) {
	var user models.User

	// returning early saves us 45ms, from 45ms down to 0ms
	if !primitive.IsValidObjectID(id) {
		return models.User{}, errors.New("invalid id")
	}

	obj_id, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return models.User{}, err
	}

	err = db.users.FindOne(context.TODO(), bson.M{"_id": obj_id}).Decode(&user)

	return user, err
}

// queries the database for a user named 'username' and returns the users data
func (db Database) GetUserByName(username string) (models.User, error) {
	var user models.User

	err := db.users.FindOne(context.TODO(), bson.M{"name": username}).Decode(&user)

	return user, err
}

// queries the database for a user named 'username' and returns true if the user was found, otherwise returns false
func (db Database) DoesUserExist(username string) bool {
	err := db.users.FindOne(context.TODO(), bson.M{"name": username}).Err()
	return err == nil
}

// checks if the given searchid is found in the followers id array of the user with the id userid
func (db Database) IsIdInUsersFollowing(userid primitive.ObjectID, searchid primitive.ObjectID) bool {
	sId, err := searchid.MarshalText()

	if err != nil {
		return false
	}

	err = db.users.FindOne(context.TODO(), bson.M{
		"_id": userid,
		"follower_ids": bson.M{
			"$elemMatch": bson.M{
				"$eq": string(sId),
			},
		},
	}).Err()

	return err == nil
}

// updates fields on the user with the given id
func (db Database) UpdateUserById(id primitive.ObjectID, update models.UpdateUser) bool {
	_, err := db.users.UpdateOne(context.TODO(), bson.M{"_id": id}, bson.M{"$set": update})
	return err == nil
}
