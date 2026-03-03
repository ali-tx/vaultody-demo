const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const vaultodyClient = require('../vaultody/client');
const auth = require('../middleware/auth');

// Register
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // 1. Create User Instance
        user = new User({ email, password: await bcrypt.hash(password, 8) });

        // 2. Call Vaultody to create ETH Wallet
        // Target Vault ID from requirements: 69286761df3ff300074b1e92
        const vaultId = user.vaultId;

        try {
            const response = await vaultodyClient.post(`/vaults/${vaultId}/${user.blockchain}/${user.network}/addresses`, {
                data: {
                    item: {
                        label: user.email
                    }
                }
            });

            // V1 response: { data: { item: { address: '...', ... } } }
            const addressData = response.data?.data?.item;
            user.walletAddress = addressData.address;
            user.vaultodyWalletId = addressData.address;

            console.log(`Address created for ${user.email}: ${user.walletAddress}`);
        } catch (vaultError) {
            console.error('Vaultody Wallet Creation Error:', vaultError.response?.data || vaultError.message);
            return res.status(502).json({
                error: 'Failed to create Vaultody wallet',
                details: vaultError.response?.data?.error?.message || vaultError.message
            });
        }

        await user.save();

        const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET || 'supersecretvaultodydemo');
        res.status(201).json({ user: { email: user.email, walletAddress: user.walletAddress }, token });

    } catch (e) {
        console.error('Registration Error:', e);
        res.status(400).send(e);
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ error: 'Invalid login credentials' });
        }

        const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET || 'supersecretvaultodydemo');
        res.json({
            user: {
                email: user.email,
                walletAddress: user.walletAddress,
                vaultodyWalletId: user.vaultodyWalletId
            },
            token
        });
    } catch (e) {
        res.status(400).send(e);
    }
});

// Me
router.get('/me', auth, async (req, res) => {
    res.json({
        user: {
            email: req.user.email,
            walletAddress: req.user.walletAddress,
            vaultodyWalletId: req.user.vaultodyWalletId,
            vaultId: req.user.vaultId
        }
    });
});

module.exports = router;
