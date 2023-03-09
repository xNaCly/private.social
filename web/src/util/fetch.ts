import { ApiResponse, UploadAvatarResponse } from "../models/Api";

export const ROUTES = {
	register: "/api/v1/auth/register",
	login: "/api/v1/auth/login",
	ping: "/api/v1/ping",
	me: "/api/v1/user/me",
	upload: "/cdn/v1/upload",
};

/**
 * xfetch is a simplified wrapper around fetch, it stringifies the body, adds the token to the Authorization http header and makes the given request specified by method. It awaits the response and awaits the json of the response. Default timeout is 5000ms.
 * @param {string} path - The path to the endpoint
 * @param {object} options - The options to pass to fetch
 * - options.method: The HTTP method to use
 * - options.body: The body to send to the endpoint. If the body is an object, it will be stringified
 * - options.token: The token to send to the endpoint, xfetch will automatically add the Bearer prefix to the Authorization header
 * @returns {Promise<ApiResponse>} - the promise of json
 */
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
