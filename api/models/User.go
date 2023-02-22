package models

import "time"

type User struct {
	Id          string    `json:"id"`
	Private     bool      `json:"private"`      // if the account is private, impacts the visibility of the user's posts
	Name        string    `json:"name"`         // the username of the user
	DisplayName string    `json:"display_name"` // the users changeable name which is displayed to other users
	Link        string    `json:"link"`         // link to the users profile
	Avatar      string    `json:"avatar"`       // the users avatar, preferably sourced from the cdn
	CreatedAt   string    `json:"created_at"`
	Bio         UserBio   `json:"bio"`
	Stats       UserStats `json:"stats"`
}

func NewUser() *User {
    usr := User{
        CreatedAt: time.Now().Unix(),
    }
    return &usr
}

type UserBio struct {
	Text     string `json:"text"`     // contains the biography text
	Pronouns string `json:"pronouns"` // contains the custom pronouns
	Location string `json:"location"` // contains the custom location
	Website  string `json:"website"`  // contains the custom website
}

type UserStats struct {
	Followers int `json:"followers"`
	Following int `json:"following"`
	Posts     int `json:"posts"`
}
