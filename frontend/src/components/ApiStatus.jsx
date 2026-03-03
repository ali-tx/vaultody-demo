import React, { useState, useEffect } from 'react';
import { checkHealth } from '../services/api';
import { Activity, XCircle, CheckCircle2 } from 'lucide-react';

const ApiStatus = () => {
    const [status, setStatus] = useState('checking'); // checking, ok, error

    useEffect(() => {
        const ping = async () => {
            try {
                // Actually, the /health endpoint is on our backend, which doesn't check Vaultody connectivity 
                // explicitly unless we add that logic. But it confirms our backend is up.
                await checkHealth();
                setStatus('ok');
            } catch (e) {
                setStatus('error');
            }
        };
        ping();
        // Poll every 30s
        const interval = setInterval(ping, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${status === 'ok' ? 'bg-green-500/10 text-green-400' :
                status === 'error' ? 'bg-red-500/10 text-red-400' :
                    'bg-gray-700 text-gray-400'
            }`}>
            {status === 'checking' && <Activity className="w-4 h-4 animate-pulse" />}
            {status === 'ok' && <CheckCircle2 className="w-4 h-4" />}
            {status === 'error' && <XCircle className="w-4 h-4" />}
            <span>
                {status === 'checking' && 'Connecting...'}
                {status === 'ok' && 'Backend Connected'}
                {status === 'error' && 'Connection Error'}
            </span>
        </div>
    );
};

export default ApiStatus;
