const crypto = require('crypto');

/**
 * Generates the HMAC-SHA256 signature required by Vaultody.
 * 
 * @param {string} apiSecret - The Base64 encoded API secret
 * @param {string} timestamp - UNIX timestamp in seconds
 * @param {string} method - HTTP method (GET, POST, etc.)
 * @param {string} path - Request path (e.g. /v1/vaults)
 * @param {string} body - Request body (stringified JSON) or empty string
 * @param {string} query - Query string or empty string
 * @returns {string} Base64 encoded signature
 */
const generateSignature = (apiSecret, timestamp, method, path, bodyStr = '{}', queryStr = '{}') => {
    if (!apiSecret) {
        throw new Error('API Secret is missing');
    }

    const methodUpper = method.toUpperCase();

    // Ensure body and query are strictly '{}' if empty or falsy (Attempt 11 verified)
    const finalBody = (bodyStr && bodyStr !== '') ? bodyStr : '{}';
    const finalQuery = (queryStr && queryStr !== '') ? queryStr : '{}';

    // 3. Create message string: timestamp + method + request_path + body + query
    const message = `${timestamp}${methodUpper}${path}${finalBody}${finalQuery}`;

    // 4. Decode Base64 API secret
    const decodedSecret = Buffer.from(apiSecret, 'base64');

    // 5. HMAC-SHA256 sign the message with decoded secret
    const hmac = crypto.createHmac('sha256', decodedSecret);
    hmac.update(message);

    // 6. Base64 encode the signature
    return hmac.digest('base64');
};

module.exports = {
    generateSignature
};
