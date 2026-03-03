const axios = require('axios');
const crypto = require('crypto');
require('dotenv').config({ path: '../.env' });

const config = {
    apiKey: process.env.VAULTODY_API_KEY,
    apiSecret: process.env.VAULTODY_API_SECRET,
    passphrase: process.env.VAULTODY_PASSPHRASE,
    baseUrl: 'https://rest.vaultody.com'
};

const generateSignature = (apiSecret, timestamp, method, path, bodyStr, queryStr) => {
    const message = `${timestamp}${method}${path}${bodyStr}${queryStr}`;
    const hmac = crypto.createHmac('sha256', Buffer.from(apiSecret, 'base64'));
    hmac.update(message);
    return hmac.digest('base64');
};

const testPost = async () => {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const vaultId = '69286761df3ff300074b1e92';
    // Working hypothesis: NO /v1 prefix
    const path = `/vaults/${vaultId}/ethereum/sepolia/addresses`;
    const method = 'POST';

    const postBody = { data: { item: { label: "final_diag" } } };
    const bodyStr = JSON.stringify(postBody);
    const queryStr = '{}';

    const signature = generateSignature(config.apiSecret, timestamp, method, path, bodyStr, queryStr);

    console.log(`Testing POST to: ${path}`);
    console.log(`Message: ${timestamp}${method}${path}${bodyStr}${queryStr}`);

    try {
        const response = await axios.post(`${config.baseUrl}${path}`, postBody, {
            headers: {
                'x-api-key': config.apiKey,
                'x-api-sign': signature,
                'x-api-timestamp': timestamp,
                'x-api-passphrase': config.passphrase,
                'Content-Type': 'application/json'
            },
            validateStatus: () => true
        });

        console.log(`Status: ${response.status}`);
        console.log(`Data: ${JSON.stringify(response.data, null, 2)}`);
    } catch (e) {
        console.error('Error:', e.message);
    }
};

testPost();
