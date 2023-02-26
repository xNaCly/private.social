export function getToken(): string | null {
	return localStorage.getItem("bearer");
}

export function setToken(token: string){
    localStorage.setItem("bearer", token)
}
