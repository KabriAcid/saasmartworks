import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import bcrypt from "bcrypt";

const bcryptRounds = 12;
const bcryptMaxPasswordBytes = 72;
const scryptOptions = { N: 131072, r: 8, p: 1, maxmem: 256 * 1024 * 1024 };
function derive(password: string, salt: string) {
	return new Promise<Buffer>((resolve, reject) =>
		scrypt(password, salt, 64, scryptOptions, (error, key) =>
			error ? reject(error) : resolve(key),
		),
	);
}
export async function hashPassword(password: string) {
	if (Buffer.byteLength(password, "utf8") > bcryptMaxPasswordBytes) {
		throw new Error("Bcrypt passwords cannot exceed 72 UTF-8 bytes.");
	}
	return bcrypt.hash(password, bcryptRounds);
}
export async function verifyPassword(password: string, encoded: string) {
	if (/^\$2[aby]\$\d{2}\$/.test(encoded)) {
		if (Buffer.byteLength(password, "utf8") > bcryptMaxPasswordBytes) {
			return false;
		}
		return bcrypt.compare(password, encoded);
	}

	const parts = encoded.split("$");
	if (
		parts.length !== 6 ||
		parts.slice(0, 4).join("$") !== "scrypt$131072$8$1" ||
		!/^[a-f0-9]{32}$/.test(parts[4]) ||
		!/^[a-f0-9]{128}$/.test(parts[5])
	) {
		return false;
	}
	return timingSafeEqual(
		await derive(password, parts[4]),
		Buffer.from(parts[5], "hex"),
	);
}
