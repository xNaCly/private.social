export interface IPost {
	id: string;
	url: string;
	description: string;
	created_at: Date;
	like_amount: number;
	comment_amount: number;
	author: string;
}
