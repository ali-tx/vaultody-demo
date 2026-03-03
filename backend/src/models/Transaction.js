const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['deposit', 'transfer'],
        required: true
    },
    amount: {
        type: String, // Use string for precision with crypto
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    txHash: {
        type: String,
        default: null
    },
    fromAddress: {
        type: String,
        default: null
    },
    toAddress: {
        type: String,
        default: null
    },
    metadata: {
        type: Object,
        default: {}
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Transaction', transactionSchema);
