import { ROUTES, xfetch } from "./fetch";

export function getToken(): string | null {
	return localStorage.getItem("bearer");
}

export function setToken(token: string) {
	localStorage.setItem("bearer", token);
}

export function removeToken() {
	localStorage.removeItem("bearer");
}

export async function isBackendAvailable(): Promise<boolean> {
	try {
		return (await xfetch(ROUTES.ping, {})).success;
	} catch {
		return false;
	}
}
