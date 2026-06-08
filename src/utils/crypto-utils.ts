import crypto from "node:crypto";

const ALGORITHM = "aes-256-cbc";
export function encryptContent(text: string, password: string): string {
	const key = crypto.createHash("sha256").update(password).digest();
	const iv = crypto.randomBytes(16);
	const cipher = crypto.createCipheriv(
		ALGORITHM,
		new Uint8Array(key),
		new Uint8Array(iv),
	);
	let encrypted = cipher.update(text, "utf8", "base64");
	encrypted += cipher.final("base64");
	return `${iv.toString("base64")}:${encrypted}`;
}
