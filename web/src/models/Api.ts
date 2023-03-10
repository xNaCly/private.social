import { IPost } from "./Post";

// generic api response, used for all api calls, errors and success
export interface IResponse {
	success: boolean;
	message: string;
	code: string;
	data: any | null;
}

// request to PUT /v1/user/me
export interface IUpdateUserRequest {
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

// request to POST /v1/post/
export interface ICreatePostRequest {
	url: string;
	description: string;
}

// response from POST /v1/post/
export interface IApiCreatePostResponse {
	url: string;
	description: string;
}

// response from POST /v1/post/me
export interface IPostsResponse extends IResponse {
	data: {
		posts: IPost[];
	};
}

// response from cdn POST /v1/upload/
export interface IUploadAvatarResponse extends IResponse {
	data: {
		path: string;
	};
}
