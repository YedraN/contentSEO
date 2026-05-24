import { describe, it, expect, beforeAll } from "vitest";
import { encrypt, decrypt } from "@/lib/encryption";

beforeAll(() => {
  process.env.ENCRYPTION_KEY = "test_key_for_unit_tests_32chars_x";
});

describe("encryption v2 (AES-256-GCM)", () => {
  it("encripta y desencripta correctamente", () => {
    const original = "my_secret_password_123";
    expect(decrypt(encrypt(original))).toBe(original);
  });

  it("produce outputs diferentes para el mismo input (IV aleatorio)", () => {
    const enc1 = encrypt("hello");
    const enc2 = encrypt("hello");
    expect(enc1).not.toBe(enc2);
    expect(decrypt(enc1)).toBe("hello");
    expect(decrypt(enc2)).toBe("hello");
  });

  it("maneja strings vacíos", () => {
    expect(decrypt(encrypt(""))).toBe("");
  });

  it("maneja caracteres especiales y unicode", () => {
    const original = "contraseña!@#$%^&*()_+ñáéíóú";
    expect(decrypt(encrypt(original))).toBe(original);
  });

  it("maneja strings largos", () => {
    const original = "a".repeat(1000);
    expect(decrypt(encrypt(original))).toBe(original);
  });

  it("maneja strings con saltos de línea", () => {
    const original = "line1\nline2\r\nline3";
    expect(decrypt(encrypt(original))).toBe(original);
  });

  it("retorna string vacío para datos inválidos", () => {
    expect(decrypt("")).toBe("");
    expect(decrypt("invalid-format")).toBe("");
    expect(decrypt("2:bad:data")).toBe("");
  });
});

describe("backwards compatibility con v1 (AES-256-CBC legacy)", () => {
  it("desencripta valores en formato v1 (ivHex:ciphertext)", () => {
    // Generar un valor legacy con la implementación v1 para simular BD antigua
    const crypto = require("crypto");
    const key = process.env.ENCRYPTION_KEY!;
    const legacyKey = crypto.scryptSync(key, "salt", 32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", legacyKey, iv);
    let ciphertext = cipher.update("legacy_password", "utf-8", "hex");
    ciphertext += cipher.final("hex");
    const legacyEncrypted = `${iv.toString("hex")}:${ciphertext}`;

    expect(decrypt(legacyEncrypted)).toBe("legacy_password");
  });
});
