import { xfetch } from "./fetch";

export function getToken(): string | null {
	return localStorage.getItem("bearer");
}

export function setToken(token: string) {
	localStorage.setItem("bearer", token);
}

export async function isBackendAvailable(): Promise<boolean> {
	try {
		return (await xfetch("/ping", {})).success;
	} catch {
		return false;
	}
}
