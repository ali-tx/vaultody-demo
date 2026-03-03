import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { History, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle } from 'lucide-react';

const TransactionHistory = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTransactions = async () => {
        try {
            const res = await axios.get('/api/wallets/transactions');
            setTransactions(res.data);
        } catch (err) {
            console.error('Failed to fetch transactions', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Clock className="w-8 h-8 text-slate-700 animate-pulse" />
                <p className="text-sm text-slate-500">Loading activity...</p>
            </div>
        );
    }

    if (transactions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-slate-600">
                    <History className="w-8 h-8" />
                </div>
                <div>
                    <h4 className="text-white font-medium">No activity yet</h4>
                    <p className="text-sm text-slate-500 max-w-xs mx-auto mt-1">
                        When you perform transfers or receive deposits, they will appear here.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-2 mb-4">Recent Activity</h4>
            <div className="space-y-3">
                {transactions.map((tx) => (
                    <div
                        key={tx._id}
                        className="group flex items-center justify-between p-4 bg-slate-800/30 hover:bg-slate-800/50 border border-slate-800/50 rounded-xl transition-all"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-slate-900 border ${tx.type === 'transfer' ? 'border-red-500/20 text-red-500' : 'border-green-500/20 text-green-500'
                                }`}>
                                {tx.type === 'transfer' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-white capitalize">{tx.type}</p>
                                <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                                    {tx.type === 'transfer' ? `To: ${tx.toAddress.substring(0, 10)}...` : `From: ${tx.fromAddress.substring(0, 10)}...`}
                                </p>
                            </div>
                        </div>

                        <div className="text-right">
                            <p className={`text-sm font-bold ${tx.type === 'transfer' ? 'text-white' : 'text-green-400'}`}>
                                {tx.type === 'transfer' ? '-' : '+'}{tx.amount} ETH
                            </p>
                            <div className="flex items-center justify-end gap-1.5 mt-1">
                                {tx.status === 'completed' ? (
                                    <CheckCircle className="w-3 h-3 text-green-500" />
                                ) : (
                                    <XCircle className="w-3 h-3 text-red-500" />
                                )}
                                <span className="text-[10px] text-slate-500">
                                    {new Date(tx.timestamp).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TransactionHistory;
