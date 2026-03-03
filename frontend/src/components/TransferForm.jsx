import React, { useState } from 'react';
import axios from 'axios';
import { Send, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

const USDC_SEPOLIA_ADDRESS = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238';

const TransferForm = ({ onSuccess }) => {
    const [toAddress, setToAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [selectedAsset, setSelectedAsset] = useState('ETH'); // 'ETH' | 'USDC'
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null); // 'success' | 'error'
    const [message, setMessage] = useState('');

    const handleTransfer = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        try {
            const assetType = selectedAsset === 'ETH' ? 'coin' : 'token';
            const contractAddress = selectedAsset === 'USDC' ? USDC_SEPOLIA_ADDRESS : null;

            const res = await axios.post('/api/wallets/transfer', {
                toAddress,
                amount,
                assetType,
                contractAddress
            });

            setStatus('success');
            setMessage(`${selectedAsset} transfer initiated successfully!`);
            setToAddress('');
            setAmount('');
            if (onSuccess) setTimeout(onSuccess, 3000);
        } catch (err) {
            setStatus('error');
            setMessage(err.response?.data?.error?.message || err.response?.data?.error || 'Transfer failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto py-4">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <Send className="w-5 h-5 text-blue-500" />
                Send Assets
            </h3>

            {status && (
                <div className={`mb-8 p-4 rounded-xl flex items-start gap-4 animate-in fade-in zoom-in duration-300 ${status === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'
                    }`}>
                    {status === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                    <p className="text-sm font-medium">{message}</p>
                </div>
            )}

            <form onSubmit={handleTransfer} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">Recipient Address</label>
                    <input
                        type="text"
                        required
                        value={toAddress}
                        onChange={(e) => setToAddress(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 px-4 text-white focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-700 font-mono text-sm"
                        placeholder="0x..."
                    />
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1 space-y-2">
                        <label className="text-sm font-medium text-slate-400">Asset</label>
                        <select
                            value={selectedAsset}
                            onChange={(e) => setSelectedAsset(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 px-4 text-white focus:ring-1 focus:ring-blue-500 outline-none transition-all font-bold text-sm"
                        >
                            <option value="ETH">ETH</option>
                            <option value="USDC">USDC (Sepolia)</option>
                        </select>
                    </div>

                    <div className="col-span-2 space-y-2">
                        <label className="text-sm font-medium text-slate-400">Amount</label>
                        <div className="relative">
                            <input
                                type="number"
                                step="0.000000000000000001"
                                required
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 px-4 text-white focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-700 font-bold"
                                placeholder="0.0"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 font-bold text-sm">{selectedAsset}</span>
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : `Confirm ${selectedAsset} Transfer`}
                    </button>
                    <p className="text-[10px] text-center text-slate-600 mt-4 uppercase tracking-[0.2em]">Secured by Vaultody Enterprise HSM</p>
                </div>
            </form>
        </div>
    );
};

export default TransferForm;
