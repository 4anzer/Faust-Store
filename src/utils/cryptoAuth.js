// Web Crypto API utility for secure SHA-256 hashing and session management

/**
 * Hash a plain string with SHA-256
 */
export async function hashStringSHA256(message) {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Default fallback credentials if .env is not yet configured
 * Default User: 'admin'
 * Default Pass: 'admin_faust_2026!'
 */
const DEFAULT_ADMIN_USER = 'admin';
const DEFAULT_ADMIN_PASS = 'admin_faust_2026!';

/**
 * Verify admin credentials against environment variables or safe defaults
 */
export async function verifyAdminCredentials(inputUsername, inputPassword) {
  // Read environment variables (Vite requires VITE_ prefix for client exposure)
  const envUsername = import.meta.env.VITE_ADMIN_USERNAME || DEFAULT_ADMIN_USER;
  const envPassword = import.meta.env.VITE_ADMIN_PASSWORD || DEFAULT_ADMIN_PASS;
  const envPasswordHash = import.meta.env.VITE_ADMIN_PASSWORD_HASH;

  // 1. Verify username (case-sensitive)
  if (inputUsername.trim() !== envUsername.trim()) {
    return { success: false, message: 'Username admin tidak ditemukan!' };
  }

  // 2. Verify password
  // If an exact SHA-256 hash was provided in .env
  if (envPasswordHash) {
    const inputHash = await hashStringSHA256(inputPassword);
    if (inputHash.toLowerCase() === envPasswordHash.toLowerCase().trim()) {
      return { success: true };
    }
    return { success: false, message: 'Password admin salah!' };
  }

  // Otherwise, compare via hash comparison against envPassword
  const inputHash = await hashStringSHA256(inputPassword);
  const expectedHash = await hashStringSHA256(envPassword);

  if (inputHash === expectedHash) {
    return { success: true };
  }

  return { success: false, message: 'Password admin salah!' };
}

/**
 * Generate a cryptographically random session token
 */
export function generateSessionToken() {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}
