import { createHash, randomBytes } from "crypto";

/**
 * hashes a key using SHA-256.
 * Note: For passwords, use bcrypt/argon2. For API keys (high entropy), fast hashing like SHA-256 is acceptable
 * if the keys are long and random enough, but generally for "hashed tokens" SHA-256 is standard pattern (like Github).
 */
export function hashApiKey(key: string): string {
    return createHash("sha256").update(key).digest("hex");
}

export function generateSecureToken(prefix: string = "sk"): string {
    const bytes = randomBytes(24);
    // Convert to hex
    const token = bytes.toString("hex");
    return `${prefix}_${token}`;
}
