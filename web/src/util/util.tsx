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

const minute = 60 * 1000;
const hour = minute * 60;
const day = hour * 24;
const week = 7 * day;
const month = 4 * week;

/**
 * Returns a string representing the time since the given date.
 * If the time is less than a minute, it will return "less than a minute ago".
 * If the time is less than an hour, it will return "x minutes ago".
 * If the time is less than a day, it will return "x hours ago".
 * If the time is less than a week, it will return "x days ago".
 * If the time is less than a month, it will return "x weeks ago". (a month is simplified to 30 days)
 * @param {data} date date object
 * @returns {string} string representation of date, optimized for display
 */
export function formatDate(date: Date): string {
	if (date == null) return "";
	let calc: number = Date.now() - new Date(date).getTime();

	if (calc < minute) {
		return "less than a minute ago";
	} else if (calc < hour) {
		let minutes = Math.floor(calc / minute);
		return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
	} else if (calc < day) {
		let hours = Math.floor(calc / hour);
		return `${hours} hour${hours > 1 ? "s" : ""} ago`;
	} else if (calc < week) {
		let days = Math.floor(calc / day);
		return `${days} day${days > 1 ? "s" : ""} ago`;
	} else if (calc < month) {
		let weeks = Math.floor(calc / week);
		return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
	}

	return date.toLocaleDateString();
}
