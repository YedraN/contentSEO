import { describe, it, expect } from "vitest";
import { encrypt, decrypt } from "@/lib/encryption";

describe("encryption", () => {
  it("debe encriptar y desencriptar correctamente", () => {
    const original = "my_secret_password_123";
    const encrypted = encrypt(original);
    const decrypted = decrypt(encrypted);
    expect(decrypted).toBe(original);
  });

  it("debe manejar strings vacíos", () => {
    const encrypted = encrypt("");
    const decrypted = decrypt(encrypted);
    expect(decrypted).toBe("");
  });

  it("debe manejar caracteres especiales", () => {
    const original = "contraseña!@#$%^&*()_+ñáéíóú";
    const encrypted = encrypt(original);
    const decrypted = decrypt(encrypted);
    expect(decrypted).toBe(original);
  });

  it("debe manejar strings largos", () => {
    const original = "a".repeat(1000);
    const encrypted = encrypt(original);
    const decrypted = decrypt(encrypted);
    expect(decrypted).toBe(original);
  });

  it("debe manejar strings con saltos de línea", () => {
    const original = "line1\nline2\r\nline3";
    const encrypted = encrypt(original);
    const decrypted = decrypt(encrypted);
    expect(decrypted).toBe(original);
  });

  it("debe retornar string vacío al desencriptar datos inválidos", () => {
    expect(decrypt("")).toBe("");
    expect(decrypt("invalid-format")).toBe("");
    expect(decrypt("not-a-valid-hex:data")).toBe("");
    expect(decrypt("0000000000000000:nothex")).toBe("");
  });

  it("debe producir diferentes outputs para diferentes inputs", () => {
    const enc1 = encrypt("hello");
    const enc2 = encrypt("world");
    expect(enc1).not.toBe(enc2);
  });
});
