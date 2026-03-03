const express = require('express');
const router = express.Router();
const vaultodyClient = require('../vaultody/client');
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');

const USDC_SEPOLIA_ADDRESS = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238';

// Get Balances (ETH and USDC)
router.get('/balance', auth, async (req, res) => {
    try {
        const { vaultId, walletAddress, blockchain } = req.user;

        console.log(`Fetching balances for address: ${walletAddress} in vault: ${vaultId}`);

        // Get all assets for this address (NO /v1)
        const response = await vaultodyClient.get(`/vaults/${vaultId}/addresses/${walletAddress}/assets`);
        const assets = response.data?.data?.item?.assets || [];

        // Map to a more friendly format for frontend
        let balances = assets.map(asset => ({
            assetId: asset.assetId,
            symbol: asset.name, // 'ETH', 'USDC'
            name: asset.fullName,
            balance: asset.assetData?.totalAmount || '0',
            available: asset.assetData?.availableAmount || '0',
            type: asset.contractAddress ? 'token' : 'coin',
            contractAddress: asset.contractAddress || null
        }));

        // If no assets returned (e.g. fresh wallet), provide defaults
        if (balances.length === 0) {
            balances = [
                { symbol: 'ETH', name: 'Ethereum', balance: '0.00', available: '0.00', type: 'coin' },
                { symbol: 'USDC', name: 'USD Coin', balance: '0.00', available: '0.00', type: 'token', contractAddress: USDC_SEPOLIA_ADDRESS }
            ];
        }

        res.json({ balances });
    } catch (e) {
        console.error('Balance Error:', JSON.stringify(e.response?.data || e.message, null, 2));
        res.status(e.response?.status || 500).json(e.response?.data || { error: e.message });
    }
});

// Get Deposit Address
router.get('/address', auth, async (req, res) => {
    res.json({ address: req.user.walletAddress });
});

// Transfer (Supports ETH and Tokens)
router.post('/transfer', auth, async (req, res) => {
    try {
        const { vaultId, blockchain, network, walletAddress } = req.user;
        const { toAddress, amount, assetType, contractAddress } = req.body;

        // assetType: 'coin' or 'token'
        const isToken = assetType === 'token';

        console.log(`Initiating ${assetType} transfer of ${amount} to ${toAddress} from ${walletAddress}...`);

        let response;
        if (isToken) {
            // POST /vaults/{vaultId}/{blockchain}/{network}/token-transaction-requests
            response = await vaultodyClient.post(`/vaults/${vaultId}/${blockchain}/${network}/token-transaction-requests`, {
                data: {
                    item: {
                        fromAddress: walletAddress,
                        recipientAddress: toAddress,
                        amount: amount.toString(),
                        contractAddress: contractAddress || USDC_SEPOLIA_ADDRESS,
                        feePriority: 'standard'
                    }
                }
            });
        } else {
            // POST /vaults/{vaultId}/{blockchain}/{network}/transaction-requests
            response = await vaultodyClient.post(`/vaults/${vaultId}/${blockchain}/${network}/transaction-requests`, {
                data: {
                    item: {
                        fromAddress: walletAddress,
                        recipientAddress: toAddress,
                        amount: amount.toString(),
                        feePriority: 'standard'
                    }
                }
            });
        }

        const vaultTx = response.data?.data?.item || response.data?.data || response.data;

        // Save local transaction record
        const transaction = new Transaction({
            userId: req.user._id,
            type: 'transfer',
            amount: amount,
            toAddress,
            fromAddress: walletAddress,
            txHash: vaultTx.requestId || null,
            status: 'completed',
            metadata: { assetType, contractAddress, feePriority: 'standard' }
        });
        await transaction.save();

        res.json(response.data);
    } catch (e) {
        console.error('Transfer Error:', JSON.stringify(e.response?.data || e.message, null, 2));
        res.status(e.response?.status || 500).json(e.response?.data || { error: e.message });
    }
});

// Get Transaction History
router.get('/transactions', auth, async (req, res) => {
    try {
        const { vaultId, vaultodyWalletId } = req.user;
        // Option A: Fetch from Vaultody
        // Option B: Fetch from local DB
        const transactions = await Transaction.find({ userId: req.user._id }).sort({ timestamp: -1 });
        res.json(transactions);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;
