// ONLY FOR HARDCODED SERVER PASSWORD. NOT SAFE FOR USER GENERATED PASSWORDS.
import { timingSafeEqual } from "jsr:@std/crypto/timing-safe-equal";

function getFileServerPassword(): string {
    const password = Deno.env.get("FILE_SERVER_PASSWORD");
    if(password === undefined) {
        throw new Error(`Password not set in .env. Set it as FILE_SERVER_PASSWORD="<password>"`)
    }
    return password!;
}

/** Be careful, it's not encrypted */
export const FILE_SERVER_PASSWORD: string = getFileServerPassword();

// safe compare func from https://docs.deno.com/examples/timing_safe_comparison/
// prevents attackers from sniffing out info when getting password wrong
/** Compares two strings in constant time. */
export async function safeCompare(actual: string, expected: string) {
    const encoder = new TextEncoder();
    const [a, b] = await Promise.all([
        crypto.subtle.digest("SHA-256", encoder.encode(actual)),
        crypto.subtle.digest("SHA-256", encoder.encode(expected)),
    ]);
    return timingSafeEqual(a, b);
}
