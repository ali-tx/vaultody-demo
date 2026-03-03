import React, { useState } from 'react';
import { getVaultBalance, getVaultTransactions } from '../services/api';
import { RefreshCw, Wallet, History } from 'lucide-react';

const VaultInfo = ({ vault }) => {
    const [balance, setBalance] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('balance');

    const fetchData = async () => {
        if (!vault || !vault.id) return;
        setLoading(true);
        setError(null);
        try {
            // Parallel fetch
            const [balRes, txRes] = await Promise.allSettled([
                getVaultBalance(vault.id),
                getVaultTransactions(vault.id)
            ]);

            if (balRes.status === 'fulfilled') setBalance(balRes.value);
            if (txRes.status === 'fulfilled') setTransactions(txRes.value); // Assuming array or object with items

            // If both failed, show error
            if (balRes.status === 'rejected' && txRes.status === 'rejected') {
                throw new Error('Failed to fetch data');
            }

        } catch (err) {
            console.error(err);
            setError('Failed to fetch vault details. Check credentials or network.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                        {vault.name || 'Unknown Vault'}
                    </h2>
                    <p className="text-slate-400 font-mono text-sm mt-1">{vault.id}</p>
                </div>
                <button
                    onClick={fetchData}
                    disabled={loading}
                    className="p-2 hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
                    title="Refresh Data"
                >
                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                    {error}
                </div>
            )}

            <div className="flex gap-4 mb-6 border-b border-slate-700">
                <button
                    onClick={() => setActiveTab('balance')}
                    className={`pb-2 px-1 flex items-center gap-2 ${activeTab === 'balance' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-slate-400 hover:text-white'}`}
                >
                    <Wallet className="w-4 h-4" /> Balance
                </button>
                <button
                    onClick={() => setActiveTab('transactions')}
                    className={`pb-2 px-1 flex items-center gap-2 ${activeTab === 'transactions' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-slate-400 hover:text-white'}`}
                >
                    <History className="w-4 h-4" /> Transactions
                </button>
            </div>

            <div className="min-h-[200px]">
                {!balance && !transactions.length && !loading && !error && (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-2">
                        <p>No data loaded yet.</p>
                        <button onClick={fetchData} className="text-blue-400 hover:underline">Sync from API</button>
                    </div>
                )}

                {activeTab === 'balance' && balance && (
                    <div className="space-y-4">
                        {/* Render balance data - Structure depends on API response */}
                        <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                            <pre>{JSON.stringify(balance, null, 2)}</pre>
                        </div>
                    </div>
                )}

                {activeTab === 'transactions' && transactions && (
                    <div className="space-y-4">
                        {/* Render tx data - Structure depends on API response */}
                        <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                            <pre>{JSON.stringify(transactions, null, 2)}</pre>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VaultInfo;
