import { User } from "./User";
export interface ApiResponse {
	success: boolean;
	message: string;
	code: string;
	data: any | null;
}
