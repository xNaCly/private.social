package models

type Like struct {
	UserId    string `bson:"user_id" json:"user_id"`
	PostId    string `bson:"post_id" json:"post_id"`
	CreatedAt string `bson:"created_at" json:"created_at"`
}

type Comment struct {
	UserId    string `bson:"user_id" json:"user_id"`
	PostId    string `bson:"post_id" json:"post_id"`
	CreatedAt string `bson:"created_at" json:"created_at"`
	Content   string `bson:"content" json:"content"`
}
