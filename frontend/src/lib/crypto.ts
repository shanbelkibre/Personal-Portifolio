/**
 * Cryptographic security utilities for Admin Authentication
 * Uses Web Crypto API SHA-256 digest hashing.
 */

export async function hashPasscode(passcode: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(passcode);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

export async function verifyPasscode(input: string, storedHash: string): Promise<boolean> {
  // If stored value is legacy plain text (e.g., admin123), match directly or hash
  if (storedHash === input) return true;
  const inputHash = await hashPasscode(input);
  return inputHash === storedHash;
}
