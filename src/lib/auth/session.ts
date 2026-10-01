import {
	SignJWT,
	jwtVerify,
	type JWTPayload,
} from "jose";

export const sessionCookieName = "saa_session";
const issuer = "saa-smart-works";
const audience = "saa-admin";
const sessionDuration = "8h";

function getSigningKey() {
	const secret = process.env.SESSION_SECRET;
	if (!secret || new TextEncoder().encode(secret).byteLength < 32) {
		throw new Error("SESSION_SECRET must contain at least 32 bytes.");
	}
	return new TextEncoder().encode(secret);
}

export async function signSession(userId: string, credentialVersion: string) {
	return new SignJWT({ credentialVersion })
		.setProtectedHeader({ alg: "HS256" })
		.setIssuer(issuer)
		.setAudience(audience)
		.setSubject(userId)
		.setIssuedAt()
		.setExpirationTime(sessionDuration)
		.sign(getSigningKey());
}

export async function verifySession(token: string): Promise<JWTPayload | null> {
	try {
		const { payload } = await jwtVerify(token, getSigningKey(), {
			algorithms: ["HS256"],
			requiredClaims: ["sub", "iat", "exp", "credentialVersion"],
			issuer,
			audience,
		});
		return typeof payload.sub === "string" && payload.sub.length > 0 && typeof payload.credentialVersion === "string" ? payload : null;
	} catch {
		return null;
	}
}
