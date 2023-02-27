import { api as api_url } from "../config.json";
import { ApiResponse } from "../models/Api";

export const ROUTES = {
	register: "/auth/register",
	login: "/auth/login",
	ping: "/ping",
	me: "/user/me",
};

export async function xfetch(
	path: string,
	options: { body?: {}; method?: string; token?: string } = {}
): Promise<ApiResponse> {
	let response = await fetch(`${api_url}${path}`, {
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
