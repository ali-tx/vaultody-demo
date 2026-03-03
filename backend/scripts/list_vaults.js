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

const listVaults = async () => {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const method = 'GET';
    const paths = [
        '/v1/vaults/all',
        '/v1/vaults/main',
        '/v1/vaults/test',
        '/vaults/all',
        '/vaults/main',
        '/vaults/test'
    ];
    const body = '{}';
    const query = '{}';

    for (const path of paths) {
        console.log(`\nTesting Path: ${path}`);
        const signature = generateSignature(config.apiSecret, timestamp, method, path, body, query);

        try {
            const response = await axios.get(`${config.baseUrl}${path}`, {
                headers: {
                    'x-api-key': config.apiKey,
                    'x-api-sign': signature,
                    'x-api-timestamp': timestamp,
                    'x-api-passphrase': config.passphrase,
                    'Content-Type': 'application/json'
                },
                validateStatus: () => true
            });

            if (response.status === 200) {
                console.log(`✅ SUCCESS on path: ${path}`);
                console.log(JSON.stringify(response.data, null, 2));
                return;
            } else {
                console.log(`❌ FAILED on path: ${path}. Status: ${response.status}, Error: ${response.data?.error?.code || 'unknown'}`);
            }
        } catch (e) {
            console.error(`Error on path ${path}:`, e.message);
        }
    }
};

listVaults();
