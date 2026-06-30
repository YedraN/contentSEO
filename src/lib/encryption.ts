import crypto from "crypto";

function getKey(): string {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error("ENCRYPTION_KEY environment variable is not set. Add it to your .env file.");
  }
  return key;
}

// v2: AES-256-GCM with random salt per encryption
// format: "2:<saltHex>:<ivHex>:<authTagHex>:<ciphertextHex>"
export function encrypt(text: string): string {
  const key = getKey();
  const salt = crypto.randomBytes(16);
  const derivedKey = crypto.scryptSync(key, salt, 32);
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", derivedKey, iv);
  let ciphertext = cipher.update(text, "utf-8", "hex");
  ciphertext += cipher.final("hex");
  const authTag = cipher.getAuthTag();
  return `2:${salt.toString("hex")}:${iv.toString("hex")}:${authTag.toString("hex")}:${ciphertext}`;
}

export function decrypt(encryptedText: string): string {
  try {
    const key = getKey();
    const parts = encryptedText.split(":");

    if (parts[0] === "2") {
      // v2: AES-256-GCM
      const [, saltHex, ivHex, authTagHex, ciphertext] = parts;
      const derivedKey = crypto.scryptSync(key, Buffer.from(saltHex, "hex"), 32);
      const decipher = crypto.createDecipheriv(
        "aes-256-gcm",
        derivedKey,
        Buffer.from(ivHex, "hex")
      );
      decipher.setAuthTag(Buffer.from(authTagHex, "hex"));
      let decrypted = decipher.update(ciphertext, "hex", "utf-8");
      decrypted += decipher.final("utf-8");
      return decrypted;
    }

    // v1 legacy: AES-256-CBC with fixed salt — for backwards compatibility
    // format: "<ivHex>:<ciphertextHex>" (2 parts only)
    const [ivHex, ciphertext] = parts;
    const legacyKey = crypto.scryptSync(key, "salt", 32);
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      legacyKey,
      Buffer.from(ivHex, "hex")
    );
    let decrypted = decipher.update(ciphertext, "hex", "utf-8");
    decrypted += decipher.final("utf-8");
    return decrypted;
  } catch (error) {
    throw new Error(`Decryption failed: ${(error as Error).message}`);
  }
}
