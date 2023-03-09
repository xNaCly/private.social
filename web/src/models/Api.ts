import { User } from "./User";
export interface ApiResponse {
	success: boolean;
	message: string;
	code: string;
	data: any | null;
}

export interface ApiUpdateUserRequest {
	private: boolean;
	display_name: string;
	avatar: string;
	bio: {
		text: string;
		pronouns: string;
		location: string;
		website: string;
	};
}

export interface UploadAvatarResponse extends ApiResponse {
	data: {
		path: string;
	};
}
