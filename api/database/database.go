package database

import (
	"context"
	"log"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Database is a wrapper for the mongo.Client struct
var Db Database

type Database struct {
	connection *mongo.Client     // database connection
	users      *mongo.Collection // database users collection
	posts      *mongo.Collection // database posts collection
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
	log.Println("loaded tables 'users', 'posts'")
	return Database{
		connection: client,
		users:      client.Database("ps").Collection("users"),
		posts:      client.Database("ps").Collection("posts"),
	}
}
