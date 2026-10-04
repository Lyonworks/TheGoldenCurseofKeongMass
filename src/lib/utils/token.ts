import { randomBytes } from 'crypto';

/**
 * Generate a secure random user token server-side
 * Uses Node.js crypto module (secure PRNG)
 * Returns hex string similar to PHP bin2hex(random_bytes(16))
 */
export function generateSecureUserToken(): string {
  return randomBytes(16).toString('hex');
}
