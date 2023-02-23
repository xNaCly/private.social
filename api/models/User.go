package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	Id          string             `bson:"_id,omitempty" json:"id"`
	Private     bool               `bson:"private" json:"private"`           // if the account is private, impacts the visibility of the user's posts
	Name        string             `bson:"name" json:"name"`                 // the username of the user
	DisplayName string             `bson:"display_name" json:"display_name"` // the users changeable name which is displayed to other users
	Link        string             `bson:"link" json:"link"`                 // link to the users profile
	Avatar      string             `bson:"avatar" json:"avatar"`             // the users avatar, preferably sourced from the cdn
	CreatedAt   primitive.DateTime `bson:"created_at" json:"created_at"`
	Bio         UserBio            `bson:"bio" json:"bio"`
	Stats       UserStats          `bson:"stats" json:"stats"`
}

type UserBio struct {
	Text     string `bson:"text" json:"text"`         // contains the biography text
	Pronouns string `bson:"pronouns" json:"pronouns"` // contains the custom pronouns
	Location string `bson:"location" json:"location"` // contains the custom location
	Website  string `bson:"website" json:"website"`   // contains the custom website
}

type UserStats struct {
	Followers int `bson:"followers" json:"followers"`
	Following int `bson:"following" json:"following"`
	Posts     int `bson:"posts" json:"posts"`
}
