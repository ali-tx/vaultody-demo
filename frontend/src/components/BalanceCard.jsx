import React from 'react';
import { Wallet, TrendingUp } from 'lucide-react';

const BalanceCard = ({ balances = [], loading }) => {
    return (
        <div className="space-y-4">
            {loading && balances.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl animate-pulse">
                    <div className="h-10 w-48 bg-slate-800 rounded-lg mb-4"></div>
                    <div className="h-20 w-full bg-slate-800 rounded-xl"></div>
                </div>
            ) : (
                balances.map((asset, index) => (
                    <div key={asset.assetId || index} className="relative overflow-hidden bg-slate-900 border border-slate-800 p-6 rounded-2xl group">
                        {/* Background Glow */}
                        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 blur-[80px] -mr-24 -mt-24 transition-all duration-700 group-hover:bg-blue-500/10"></div>

                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shadow-inner ${asset.symbol === 'USDC' ? 'bg-blue-600/10 border-blue-500/30' : 'bg-slate-800 border-slate-700'
                                    }`}>
                                    {asset.symbol === 'USDC' ? (
                                        <span className="text-blue-400 font-bold text-lg">S</span>
                                    ) : (
                                        <Wallet className="w-6 h-6 text-blue-400" />
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-0.5">{asset.name || 'Total Balance'}</h3>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-bold text-white tracking-tight">
                                            {asset.balance} <span className="text-lg font-normal text-slate-500">{asset.symbol}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <div className="px-4 py-2 bg-slate-800/50 rounded-xl border border-slate-700/50">
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Available</p>
                                    <p className="text-md font-bold text-green-400">{asset.available} {asset.symbol}</p>
                                </div>
                                <div className="hidden sm:flex items-center px-4 py-2 bg-slate-800/50 rounded-xl border border-slate-700/50">
                                    <TrendingUp className="w-3 h-3 text-blue-400 mr-1.5" />
                                    <span className="text-xs font-bold text-blue-400">+0.00%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}

            {balances.length === 0 && !loading && (
                <div className="bg-slate-900 border border-slate-800 p-12 rounded-2xl text-center">
                    <p className="text-slate-500 font-medium">No active assets found in this vault.</p>
                </div>
            )}
        </div>
    );
};

export default BalanceCard;
