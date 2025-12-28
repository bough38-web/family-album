// src/utils/authHelpers.js
// Simple password hashing utilities using the Web Crypto API (available in browsers)

/**
 * Hash a password using SHA-256 and encode as hex string.
 * @param {string} password
 * @returns {Promise<string>} hex-encoded hash
 */
export const hashPassword = async (password) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    // Convert buffer to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
};

/**
 * Compare a plain password with a stored hash.
 * @param {string} password plain password input
 * @param {string} hash stored hex hash
 * @returns {Promise<boolean>} true if matches
 */
export const comparePassword = async (password, hash) => {
    const hashedInput = await hashPassword(password);
    return hashedInput === hash;
};
