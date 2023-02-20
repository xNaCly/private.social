package models

type Post struct {
	Id         string   `json:"id"`
	Data       PostData `json:"data"`
	CreatorIds []string `json:"creator_id"`
	CreatedAt  string   `json:"created_at"`
	PostData   PostData `json:"post_data"`
}

type PostData struct {
	Comments    int    `json:"comments"`
	Likes       int    `json:"likes"`
	Source      string `json:"source"`
	Description string `json:"description"`
	Website     string `json:"website"`
}
