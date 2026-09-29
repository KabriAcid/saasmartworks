// Temporary local UI development mode. Never enabled in production.
export function isMockAuthEnabled() {
	return process.env.NODE_ENV === "development" && process.env.MOCK_AUTH === "true";
}

export const mockUser = {
	id: "local-demo-admin",
	name: "Demo Admin",
	email: "admin@example.com",
	role: "ADMIN",
};

export function matchesMockCredentials(email: string, password: string) {
	return email === mockUser.email && password === "Pa$$w0rd!";
}
