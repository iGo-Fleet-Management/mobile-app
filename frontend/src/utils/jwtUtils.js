/**
 * Base64 decoder function compatible with React Native
 * @param {string} str - Base64 string to decode
 * @returns {string} - Decoded string
 */
const base64Decode = (str) => {
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    try {
      return atob(base64);
    } catch (e) {
      // Fallback
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
      let output = '';
      
      str = String(str).replace(/=+$/, '');
      if (str.length % 4 === 1) {
        throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
      }
      
      for (
        let bc = 0, bs = 0, buffer, i = 0;
        (buffer = str.charAt(i++));
        ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer, bc++ % 4)
          ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
          : 0
      ) {
        buffer = chars.indexOf(buffer);
      }
      
      return output;
    }
  };
  
  /**
   * Decodes a JWT token to extract its payload
   * Uses a simplified approach that works in React Native
   * @param {string} token
   * @returns {object|null} - The decoded payload or null if invalid
   */
  export const decodeJWT = (token) => {
    try {
      if (!token) {
        return null;
      }
      
      // Split the token into its three parts
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.warn('Invalid token format');
        return null;
      }
      
      // Get the payload (middle part)
      const payload = parts[1];
      
      // Create padding if needed
      const paddedPayload = payload.padEnd(payload.length + (4 - payload.length % 4) % 4, '=');
      
      // Decode base64
      const decodedPayload = base64Decode(paddedPayload);
      
      // Parse JSON
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return null;
    }
  };
  
  /**
   * Gets user type from JWT token
   * @param {string} token
   * @returns {string|null} - The user type or null if unavailable
   */
  export const getUserTypeFromToken = (token) => {
    const decoded = decodeJWT(token);
    return decoded?.user_type || null;
  };
  
  /**
   * Checks if token is expired
   * @param {string} token
   * @returns {boolean} - True if token is expired, false otherwise
   */
  export const isTokenExpired = (token) => {
    try {
      const decoded = decodeJWT(token);
      if (!decoded || !decoded.exp) {
        return true;
      }
      
      // exp is in seconds, Date.now() is in milliseconds
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true; // If there's an error, assume token is expired
    }
  };