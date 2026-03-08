/**
 * Cryptographic utilities for DecentralChain — powered by @decentralchain/ts-lib-crypto.
 *
 * Re-exports the most commonly used primitives for key generation,
 * signing, hashing, address derivation, and encoding.
 */

import {
  // ── Key / address generation ──
  address,
  keyPair,
  publicKey,
  privateKey,
  randomSeed,
  seedWithNonce,

  // ── Signing & verification ──
  signBytes,
  verifySignature,
  verifyAddress,

  // ── Hashing ──
  blake2b,
  keccak,
  sha256,

  // ── Encoding ──
  base58Encode,
  base58Decode,
  base64Encode,
  base64Decode,
  stringToBytes,
  bytesToString,

  // ── Seed encryption ──
  encryptSeed,
  decryptSeed,

  // ── Misc ──
  concat,
  split,
  merkleVerify,
} from "@decentralchain/ts-lib-crypto";

import { DC_CHAIN_ID_BYTE } from "@/lib/constants";

/* ═══════════════════════════════════════════════════════════════
   Re-exports (barrel)
   ═══════════════════════════════════════════════════════════════ */

export {
  // Keys
  address,
  keyPair,
  publicKey,
  privateKey,
  randomSeed,
  seedWithNonce,

  // Signing
  signBytes,
  verifySignature,
  verifyAddress,

  // Hashing
  blake2b,
  keccak,
  sha256,

  // Encoding
  base58Encode,
  base58Decode,
  base64Encode,
  base64Decode,
  stringToBytes,
  bytesToString,

  // Seed
  encryptSeed,
  decryptSeed,

  // Misc
  concat,
  split,
  merkleVerify,
};

/* ═══════════════════════════════════════════════════════════════
   Convenience helpers — pre-bound to DCC chain ID
   ═══════════════════════════════════════════════════════════════ */

/**
 * Derive a DCC address from a seed phrase,
 * pre-bound to the configured chain ID byte (default: '?' = 63).
 */
export function dccAddress(seed: string, nonce?: number): string {
  const s = nonce != null ? seedWithNonce(seed, nonce) : seed;
  return address(s, DC_CHAIN_ID_BYTE);
}

/**
 * Derive a key pair (publicKey + privateKey) from a seed phrase.
 * Returns `{ publicKey: Uint8Array, privateKey: Uint8Array }`.
 */
export function dccKeyPair(seed: string, nonce?: number) {
  const s = nonce != null ? seedWithNonce(seed, nonce) : seed;
  return keyPair(s);
}

/**
 * Validate whether a given base58 address is valid on the DCC network.
 */
export function isValidDccAddress(addr: string): boolean {
  return verifyAddress(addr, { chainId: DC_CHAIN_ID_BYTE });
}

/**
 * Generate a new random 15-word seed phrase.
 */
export function generateSeed(words = 15): string {
  return randomSeed(words);
}

/**
 * Hash arbitrary data with Blake2b-256 → base58.
 */
export function hashBase58(data: Uint8Array | string): string {
  const bytes = typeof data === "string" ? stringToBytes(data) : data;
  return base58Encode(blake2b(bytes));
}

/**
 * Encrypt a seed phrase with a password.
 * Returns the encrypted seed as a base64 string.
 */
export function encryptSeedBase64(
  seed: string,
  password: string,
): string {
  return encryptSeed(seed, password);
}

/**
 * Decrypt a seed phrase from a base64-encoded encrypted string.
 */
export function decryptSeedBase64(
  encryptedBase64: string,
  password: string,
): string {
  return decryptSeed(encryptedBase64, password);
}
