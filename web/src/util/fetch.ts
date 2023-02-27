import { api as api_url } from "../config.json";
import { ApiResponse } from "../models/Api";

export const ROUTES = {
	register: "/auth/register",
	login: "/auth/login",
};

export async function xfetch(
	path: string,
	options: { body?: {}; method?: string }
): Promise<ApiResponse> {
	let response = await fetch(`${api_url}${path}`, {
		body: options.body ? JSON.stringify(options.body) : null,
		method: !options.method ? "GET" : options.method,
		headers: { "Content-Type": "application/json" },
	});

	let json = await response.json();

	return json;
}
