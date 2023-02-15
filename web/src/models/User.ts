export interface User {
	bio: {
		text: string;
		pronouns: string;
		location: string;
		website: string;
	};
	stats: {
		followers: number;
		posts: number;
		following: number;
	};
    private: boolean;
	id: number;
	name: string;
	link: string;
	avatar: string;
	created_at: Date;
}