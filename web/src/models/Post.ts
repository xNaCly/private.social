export interface IPost {
	id: number;
	data: {
		comments: number;
		likes: number;
		source: string;
		description: string;
		website: string;
	};
	creator_ids: string[];
	created_at: Date;
}
