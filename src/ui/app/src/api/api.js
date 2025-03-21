// API service for Smart Segmentation
const API_BASE_URL = 'http://localhost:8000';

// Get all customers with optional limit
export const getCustomers = async (limit = 100) => {
    try {
        // Make sure limit is a number
        const safeLimit = typeof limit === 'object' ? 100 : Number(limit);

        const response = await fetch(`${API_BASE_URL}/customers?limit=${safeLimit}`);
        if (!response.ok) {
            throw new Error('Failed to fetch customers');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching customers:', error);
        throw error;
    }
};

// Search customers using natural language query
export const searchCustomers = async (query, topK = 5) => {
    try {
        const response = await fetch(
            `${API_BASE_URL}/customers/search?query=${encodeURIComponent(query)}&top_k=${topK}`
        );
        if (!response.ok) {
            throw new Error('Failed to search customers');
        }
        return await response.json();
    } catch (error) {
        console.error('Error searching customers:', error);
        throw error;
    }
};

// Get customers by cluster
export const getCustomersByCluster = async (clusterId = null, limit = 10) => {
    try {
        let url = `${API_BASE_URL}/customers/clusters?limit=${limit}`;
        if (clusterId !== null) {
            url += `&cluster_id=${clusterId}`;
        }
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch customers by cluster');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching customers by cluster:', error);
        throw error;
    }
};

// Get cluster statistics
export const getClusterStats = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/clusters/stats`);
        if (!response.ok) {
            throw new Error('Failed to fetch cluster statistics');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching cluster statistics:', error);
        throw error;
    }
}; 