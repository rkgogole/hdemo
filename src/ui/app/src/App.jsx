import React, { useState, useEffect } from 'react';
import { getCustomers, searchCustomers, getCustomersByCluster } from './api/api';
import CustomerList from './components/CustomerList';
import CustomerSearch from './components/CustomerSearch';
import ClusterSelector from './components/ClusterSelector';
import './App.css';

function App() {
    const [viewMode, setViewMode] = useState('all'); // 'all', 'search', or 'cluster'
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClusterId, setSelectedClusterId] = useState(null);

    // Fetch all customers when the app loads
    useEffect(() => {
        fetchAllCustomers();
    }, []);

    const fetchAllCustomers = async (limit = 100) => {
        try {
            setLoading(true);
            setViewMode('all');
            setSearchQuery('');
            setSelectedClusterId(null);
            const data = await getCustomers(limit);
            setCustomers(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (query, topK) => {
        try {
            setLoading(true);
            setViewMode('search');
            setSearchQuery(query);
            setSelectedClusterId(null);
            const data = await searchCustomers(query, topK);
            setCustomers(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClusterSelect = async (clusterId) => {
        try {
            setLoading(true);
            setViewMode('cluster');
            setSearchQuery('');
            setSelectedClusterId(clusterId);
            const data = await getCustomersByCluster(clusterId);
            setCustomers(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getResultTitle = () => {
        if (viewMode === 'search' && searchQuery) {
            return `Search Results for: "${searchQuery}"`;
        } else if (viewMode === 'cluster') {
            return selectedClusterId === null
                ? 'All Customer Segments'
                : `Customers in Selected Segment`;
        } else {
            return 'All Customers';
        }
    };

    return (
        <div className="app">
            <header className="app-header">
                <div className="header-container">
                    <div className="logo-container">
                        <img 
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Allianz_Direct.png/1200px-Allianz_Direct.png" 
                            alt="Allianz Direct Logo" 
                            className="allianz-logo" 
                        />
                        <h1>Customer Insights Platform</h1>
                    </div>
                </div>
            </header>

            <div className="nav-buttons">
                <button
                    className={viewMode === 'all' ? 'active' : ''}
                    onClick={fetchAllCustomers}
                >
                    All Customers
                </button>
                <button
                    className={viewMode === 'search' ? 'active' : ''}
                    onClick={() => setViewMode('search')}
                >
                    Semantic Search
                </button>
                <button
                    className={viewMode === 'cluster' ? 'active' : ''}
                    onClick={() => setViewMode('cluster')}
                >
                    Customer Segments
                </button>
            </div>

            <main className="app-content">
                {viewMode === 'search' && (
                    <CustomerSearch onSearch={handleSearch} loading={loading} />
                )}

                {viewMode === 'cluster' && (
                    <ClusterSelector
                        onSelectCluster={handleClusterSelect}
                        selectedClusterId={selectedClusterId}
                    />
                )}

                <h2 className="results-title">{getResultTitle()}</h2>
                <CustomerList
                    customers={customers}
                    loading={loading}
                    error={error}
                />
            </main>

            <footer className="app-footer">
                <div className="footer-container">
                    <div className="footer-copyright">
                        <p>© {new Date().getFullYear()} Allianz Direct. All Rights Reserved.</p>
                    </div>
                    <div className="footer-links">
                        {/* eslint-disable-next-line */}
                        <a href="#">Privacy Policy</a>
                        {/* eslint-disable-next-line */}
                        <a href="#">Terms of Service</a>
                        {/* eslint-disable-next-line */}
                        <a href="#">Contact Us</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;
