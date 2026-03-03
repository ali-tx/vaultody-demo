import React, { useState } from 'react';
import { QrCode, Copy, CheckCircle2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const DepositPanel = ({ address }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        if (!address) return;

        const textToCopy = address;

        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(textToCopy);
                setCopied(true);
            } else {
                throw new Error('Clipboard API unavailable');
            }
        } catch (err) {
            try {
                const textArea = document.createElement("textarea");
                textArea.value = textToCopy;
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
                if (successful) setCopied(true);
            } catch (err2) {
                console.error('Copy fallback failed', err2);
            }
        }
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 sticky top-24">
            <h3 className="text-xl font-bold text-white mb-6">Deposit Assets</h3>

            <div className="flex justify-center mb-8">
                <div className="p-4 bg-white rounded-2xl shadow-xl shadow-blue-500/10">
                    {address ? (
                        <QRCodeSVG
                            value={address}
                            size={160}
                            level="H"
                            includeMargin={false}
                            imageSettings={{
                                src: "/favicon.ico", // Or any small logo if available
                                x: undefined,
                                y: undefined,
                                height: 24,
                                width: 24,
                                excavate: true,
                            }}
                        />
                    ) : (
                        <div className="w-40 h-40 bg-slate-100 flex items-center justify-center rounded-lg border-2 border-slate-200 border-dashed">
                            <QrCode className="w-16 h-16 text-slate-400 opacity-50" />
                        </div>
                    )}
                </div>
            </div>

            <p className="text-slate-400 text-sm mb-4">Your Ethereum Deposit Address</p>

            <div className="relative group">
                <div className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 pr-12 text-blue-400 font-mono text-sm break-all leading-relaxed">
                    {address || 'Loading address...'}
                </div>
                <button
                    onClick={handleCopy}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-800 border-l border-slate-800/50 rounded-lg transition-all"
                >
                    {copied ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                        <Copy className="w-5 h-5 text-slate-500 hover:text-white" />
                    )}
                </button>
            </div>

            <div className="mt-8 p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl">
                <p className="text-[11px] text-blue-300 leading-relaxed">
                    <span className="font-bold text-blue-400 block mb-1 uppercase tracking-widest">Network Notice</span>
                    Only send ETH to this address. Sending other assets like BTC or LTC will result in permanent loss.
                </p>
            </div>
        </div>
    );
};

export default DepositPanel;
