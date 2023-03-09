import { ApiResponse, UploadAvatarResponse } from "../models/Api";

export const ROUTES = {
	register: "/api/v1/auth/register",
	login: "/api/v1/auth/login",
	ping: "/api/v1/ping",
	me: "/api/v1/user/me",
	upload: "/cdn/v1/upload",
};

export async function xfetch(
	path: string,
	options: { body?: {}; method?: string; token?: string } = {}
): Promise<ApiResponse> {
	let response = await fetch(path, {
		body: options.body ? JSON.stringify(options.body) : null,
		method: options.method ?? "GET",
		signal: AbortSignal.timeout(5000),
		headers: {
			"Content-Type": "application/json",
			...(options?.token && { Authorization: `Bearer ${options.token}` }),
		},
	});

	let json = await response.json();

	return json;
}

export async function uploadCdn(file: File): Promise<UploadAvatarResponse> {
	let request = await fetch(`${ROUTES.upload}/${file.name}`, {
		method: "POST",
		body: file,
		headers: {
			"Content-Type": file.type,
		},
	});
	return await request.json();
}
