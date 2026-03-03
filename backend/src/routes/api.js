const express = require('express');
const router = express.Router();
const vaultodyClient = require('../vaultody/client');

// Generic proxy route for Vaultody API
// Captures all requests and forwards them to Vaultody
router.all('/*', async (req, res) => {
    try {
        // Extract the part after /api
        const path = req.originalUrl.replace(/^\/api/, '');
        console.log(`Proxying ${req.method} ${req.originalUrl} -> ${path}`);

        const response = await vaultodyClient.request({
            method: req.method,
            url: path,
            data: req.body
        });

        res.status(response.status).json(response.data);
    } catch (error) {
        if (error.response) {
            console.error('Vaultody API Error:', error.response.status, JSON.stringify(error.response.data, null, 2));
            res.status(error.response.status).json(error.response.data);
        } else {
            console.error('Proxy Error:', error.message);
            res.status(500).json({ error: 'Internal Server Error', details: error.message });
        }
    }
});

module.exports = router;
