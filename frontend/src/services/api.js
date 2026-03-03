import axios from 'axios';

const api = axios.create({
    baseURL: '/api', // Proxy is set up in vite.config.js
});

export const checkHealth = async () => {
    try {
        const response = await api.get('/health');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getVaults = async () => {
    try {
        // First try main network
        let response = await api.get('/vaults/main');

        // If main is empty, try test network
        if (!response.data?.data?.items || response.data.data.items.length === 0) {
            const testResponse = await api.get('/vaults/test');
            if (testResponse.data?.data?.items && testResponse.data.data.items.length > 0) {
                return testResponse.data;
            }
        }

        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getVaultBalance = async (vaultId) => {
    try {
        const response = await api.get(`/vaults/${vaultId}/balance`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getVaultTransactions = async (vaultId) => {
    try {
        const response = await api.get(`/vaults/${vaultId}/transactions`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
