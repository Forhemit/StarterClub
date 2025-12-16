/**
 * hashes a key using SHA-256 using Web Crypto API (Edge compatible).
 */
export async function hashApiKey(key: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(key);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

export function generateSecureToken(prefix: string = "sk"): string {
    const array = new Uint8Array(24);
    crypto.getRandomValues(array);
    const token = Array.from(array).map(b => b.toString(16).padStart(2, "0")).join("");
    return `${prefix}_${token}`;
}
