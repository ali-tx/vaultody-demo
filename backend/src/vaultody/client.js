const axios = require('axios');
const { generateSignature } = require('./auth');
const config = require('../config/env');

const createClient = () => {
    const { apiKey, apiSecret, passphrase, baseUrl } = config.vaultody;

    if (!apiKey || !apiSecret || !passphrase) {
        console.warn('WARNING: Monerepay credentials are missing. API calls will fail.');
    } else {
        console.log(`Vaultody Client initialized with API Key: ${apiKey.substring(0, 4)}... and Secret: ${apiSecret.substring(0, 4)}...`);
    }

    const client = axios.create({
        baseURL: baseUrl,
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'x-api-passphrase': passphrase
        }
    });

    // Request interceptor to add signature
    client.interceptors.request.use((req) => {
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const method = req.method.toUpperCase();

        const urlObj = new URL(req.url, baseUrl);

        // Definitive Solution: DO NOT include /v1 in path or signature
        const pathForSign = urlObj.pathname;

        // Definitive Solution: Query and Body MUST be literal "{}" if empty
        const queryParams = {};
        urlObj.searchParams.forEach((value, key) => {
            queryParams[key] = value;
        });
        const queryStrForSign = Object.keys(queryParams).length > 0 ? JSON.stringify(queryParams) : '{}';

        // Minify body or default to '{}'
        let bodyStrForSign = '{}';
        if (req.data) {
            bodyStrForSign = JSON.stringify(req.data);
            if (typeof req.data === 'string') {
                req.data = JSON.parse(bodyStrForSign);
            }
        }

        console.log(`\n=== API Request Debug (Definitive Solution) ===`);
        console.log(`Method: ${method}`);
        console.log(`Path (Actual/Signed): ${pathForSign}`);
        console.log(`Body (Signed): ${bodyStrForSign}`);
        console.log(`Query (Signed): ${queryStrForSign}`);
        console.log(`Message: ${timestamp}${method}${pathForSign}${bodyStrForSign}${queryStrForSign}`);

        // 4. Generate signature
        const signature = generateSignature(
            apiSecret,
            timestamp,
            method,
            pathForSign,
            bodyStrForSign,
            queryStrForSign
        );

        console.log(`Signature: ${signature}`);
        console.log(`========================\n`);

        req.headers['x-api-timestamp'] = timestamp;
        req.headers['x-api-sign'] = signature;

        return req;
    },
        (error) => {
            return Promise.reject(error);
        });

    return client;
};

module.exports = createClient();
