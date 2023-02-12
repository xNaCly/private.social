export interface INotification {
	id: number;
	message: string | undefined;
	type: "likepost" | "likestory" | "comment" | "follow" | "newpost";
	author: string;
	link: string;
	created_at: Date;
}
