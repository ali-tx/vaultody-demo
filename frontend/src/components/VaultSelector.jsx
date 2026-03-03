import React from 'react';

const VaultSelector = ({ vaults, onSelect, selectedId }) => {
    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-slate-400 mb-2">Select Vault</label>
            <select
                value={selectedId || ''}
                onChange={(e) => {
                    const v = vaults.find(v => v.id === e.target.value);
                    onSelect(v);
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            >
                <option value="" disabled>Choose a vault...</option>
                {vaults.map(v => (
                    <option key={v.id} value={v.id}>
                        {v.name} ({v.id.substring(0, 8)}...)
                    </option>
                ))}
            </select>
        </div>
    );
};

export default VaultSelector;
