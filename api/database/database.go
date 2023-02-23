package database

import (
	"context"
	"log"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/xnacly/private.social/api/models"
)

// Database is a wrapper for the mongo.Client struct
var Db Database

type Database struct {
	connection *mongo.Client
}

// establishes a connection to the database, failes if the connection cannot be established or the database is not reachable
func Connect(db_string string) Database {
	log.Println("Establishing connection to database")
	if len(db_string) == 0 {
		log.Fatal("Database string is empty, please provide a valid database string")
	}

	client, err := mongo.Connect(context.Background(), options.Client().ApplyURI(db_string))

	if err != nil {
		log.Fatalf("failed to establish database connection to '%s', error: %s", db_string, err)
	}

	err = client.Ping(context.Background(), nil)

	if err != nil {
		log.Fatalln("database is not reachable...: ", err)
	}

	log.Println("Connection to database established")
	return Database{connection: client}
}

func (db Database) InsertNewUser(user models.User) error {
	_, err := db.connection.Database("ps").Collection("users").InsertOne(context.Background(), user)
	return err
}
