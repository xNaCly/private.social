package database

import (
	"context"
	"errors"
	"log"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/xnacly/private.social/api/models"
)

// Database is a wrapper for the mongo.Client struct
var Db Database

type Database struct {
	connection *mongo.Client
	users      *mongo.Collection
}

// establishes a connection to the database, failes if the connection cannot be established or the database is not reachable
func Connect(db_string string) Database {
	log.Println("Establishing connection to database...")
	if len(db_string) == 0 {
		log.Fatal("Database string is empty, please provide a valid database string, exiting...")
	}

	client, err := mongo.Connect(context.Background(), options.Client().ApplyURI(db_string))

	if err != nil {
		log.Fatalf("failed to establish database connection to '%s', error: %s", db_string, err)
	}

	err = client.Ping(context.Background(), nil)

	if err != nil {
		log.Fatalln("database is not reachable: ", err, "exiting...")
	}

	log.Println("Connection to database established")
	return Database{connection: client, users: client.Database("ps").Collection("users")}
}

func (db Database) InsertNewUser(user models.User) (primitive.ObjectID, error) {
	res, err := db.users.InsertOne(context.TODO(), user)
	r := res.InsertedID.(primitive.ObjectID)
	return r, err
}

// findOne in mongoDb by Id
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

func (db Database) GetUserByName(username string) (models.User, error) {
	var user models.User

	err := db.users.FindOne(context.TODO(), bson.M{"name": username}).Decode(&user)

	return user, err
}

func (db Database) DoesUserExist(username string) bool {
	err := db.users.FindOne(context.TODO(), bson.M{"name": username}).Err()
	return err == nil
}

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

func (db Database) UpdateUserById(id primitive.ObjectID, update models.UpdateUser) bool {
	_, err := db.users.UpdateOne(context.TODO(), bson.M{"_id": id}, bson.M{"$set": update})
	return err == nil
}
