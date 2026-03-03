const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    vaultodyWalletId: {
        type: String,
        default: null
    },
    walletAddress: {
        type: String,
        default: null
    },
    vaultId: {
        type: String,
        default: '69286761df3ff300074b1e92'
    },
    blockchain: {
        type: String,
        default: 'ethereum'
    },
    network: {
        type: String,
        default: 'sepolia'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
