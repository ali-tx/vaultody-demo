import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
    Wallet,
    ArrowUpRight,
    ArrowDownLeft,
    History,
    RefreshCw,
    LogOut,
    CheckCircle2,
    Copy,
    ExternalLink
} from 'lucide-react';
import BalanceCard from '../components/BalanceCard';
import DepositPanel from '../components/DepositPanel';
import TransferForm from '../components/TransferForm';
import TransactionHistory from '../components/TransactionHistory';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [copySuccess, setCopySuccess] = useState(false);

    const fetchBalance = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/wallets/balance');
            setBalance(res.data?.data || res.data);
        } catch (err) {
            console.error('Failed to fetch balance', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBalance();
        // Polling every 30 seconds
        const interval = setInterval(fetchBalance, 30000);
        return () => clearInterval(interval);
    }, []);

    const copyAddress = async () => {
        if (!user?.walletAddress) return;

        const textToCopy = user.walletAddress;

        try {
            // Priority 1: Modern API (requires HTTPS)
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(textToCopy);
                setCopySuccess(true);
            } else {
                throw new Error('Clipboard API unavailable');
            }
        } catch (err) {
            // Priority 2: Fallback for HTTP (EC2, etc.)
            try {
                const textArea = document.createElement("textarea");
                textArea.value = textToCopy;

                // Ensure it's not visible but part of the DOM
                Object.assign(textArea.style, {
                    position: 'fixed',
                    left: '-9999px',
                    top: '0',
                    opacity: '0'
                });

                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();

                const successful = document.execCommand('copy');
                document.body.removeChild(textArea);

                if (successful) {
                    setCopySuccess(true);
                } else {
                    alert('Clipboard access denied. Please copy manually: ' + textToCopy);
                }
            } catch (err2) {
                console.error('Fallback copy failed', err2);
                alert('Copy failed. Manual address: ' + textToCopy);
            }
        }

        if (copySuccess || true) {
            setTimeout(() => setCopySuccess(false), 2000);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
            {/* Top Navigation */}
            <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white">
                            V
                        </div>
                        <h1 className="font-bold text-xl tracking-tight hidden sm:block">
                            Monerepay <span className="text-slate-400 font-normal italic"></span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex flex-col items-end mr-2">
                            <span className="text-xs text-slate-500">Authenticated as</span>
                            <span className="text-sm font-medium text-slate-300">{user?.email}</span>
                        </div>
                        <button
                            onClick={logout}
                            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all border border-slate-700"
                            title="Sign Out"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Wallet Dashboard</h2>
                        <div className="flex items-center gap-2 group">
                            <p className="text-slate-400 font-mono text-sm bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
                                {user?.walletAddress}
                            </p>
                            <button
                                onClick={copyAddress}
                                className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-500 hover:text-blue-400"
                                title="Copy Address"
                            >
                                {copySuccess ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={fetchBalance}
                            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all border border-slate-700 text-sm font-medium"
                        >
                            <RefreshCw className={`w-4 h-4 text-blue-400 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                        <button
                            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all shadow-lg shadow-blue-600/20 text-sm font-medium"
                            onClick={() => setActiveTab('transfer')}
                        >
                            <ArrowUpRight className="w-4 h-4" />
                            Send ETH
                        </button>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column - Overview & Stats */}
                    <div className="lg:col-span-8 space-y-8">
                        <BalanceCard balances={balance?.balances || []} loading={loading} />

                        {/* Tabs Container */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden min-h-[400px]">
                            <div className="flex border-b border-slate-800">
                                {['overview', 'transfer', 'history'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-6 py-4 text-sm font-medium transition-all relative ${activeTab === tab
                                            ? 'text-white'
                                            : 'text-slate-500 hover:text-slate-300'
                                            }`}
                                    >
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                        {activeTab === tab && (
                                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="p-6">
                                {activeTab === 'overview' && (
                                    <div className="space-y-6 animate-in fade-in duration-500">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/50">
                                                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Network</h4>
                                                <p className="text-lg font-medium text-white flex items-center gap-2">
                                                    Ethereum <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] rounded border border-blue-500/20">TESTNET</span>
                                                </p>
                                            </div>
                                            <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/50">
                                                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Vault ID</h4>
                                                <p className="text-lg font-medium text-white font-mono truncate">{user?.vaultId}</p>
                                            </div>
                                        </div>

                                        <div className="pt-4">
                                            <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
                                            <div className="space-y-3">
                                                <div className="flex justify-between py-3 border-b border-slate-800/50">
                                                    <span className="text-slate-400 text-sm">Vaultody Wallet ID</span>
                                                    <span className="text-white font-mono text-sm">{user?.vaultodyWalletId}</span>
                                                </div>
                                                <div className="flex justify-between py-3 border-b border-slate-800/50">
                                                    <span className="text-slate-400 text-sm">Creation Date</span>
                                                    <span className="text-white text-sm">Feb 4, 2026</span>
                                                </div>
                                                <div className="flex justify-between py-3">
                                                    <span className="text-slate-400 text-sm">Provider Status</span>
                                                    <span className="flex items-center gap-1.5 text-green-400 text-sm">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                                                        Active
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'transfer' && (
                                    <div className="animate-in slide-in-from-bottom-2 duration-300">
                                        <TransferForm onSuccess={() => {
                                            setActiveTab('history');
                                            fetchBalance();
                                        }} />
                                    </div>
                                )}

                                {activeTab === 'history' && (
                                    <div className="animate-in fade-in duration-500">
                                        <TransactionHistory />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Secondary Actions */}
                    <div className="lg:col-span-4 space-y-8">
                        <DepositPanel address={user?.walletAddress} />

                        <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/20 rounded-2xl p-6">
                            <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
                                <ArrowDownLeft className="w-5 h-5 text-indigo-400" />
                                Top Up Wallet
                            </h3>
                            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                                This is a test application. To top up your ETH balance on Sepolia or Goerli, use an external testnet faucet.
                            </p>
                            <a
                                href="https://sepoliafaucet.com/"
                                target="_blank"
                                rel="noreferrer"
                                className="block w-full py-3 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-xl text-center text-sm font-medium transition-colors"
                            >
                                Open Faucet
                                <ExternalLink className="w-3.5 h-3.5 inline-block ml-2 mb-0.5" />
                            </a>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
