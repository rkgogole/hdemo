import React, { useEffect, useState } from 'react';
import { getClusterStats } from '../api/api';
import './ClusterSelector.css';

const ClusterSelector = ({ onSelectCluster, selectedClusterId }) => {
    const [clusters, setClusters] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClusters = async () => {
            try {
                setLoading(true);
                const data = await getClusterStats();
                setClusters(data.clusters);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchClusters();
    }, []);

    if (loading) {
        return <div className="clusters-loading">Loading clusters...</div>;
    }

    if (error) {
        return <div className="clusters-error">Error loading clusters: {error}</div>;
    }

    return (
        <div className="cluster-selector">
            <h2>Customer Segments</h2>
            <div className="clusters-container">
                <div
                    className={`cluster-card ${selectedClusterId === null ? 'selected' : ''}`}
                    onClick={() => onSelectCluster(null)}
                >
                    <h3>All Segments</h3>
                    <p>View customers across all segments</p>
                </div>

                {Object.entries(clusters).map(([id, cluster]) => (
                    <div
                        key={id}
                        className={`cluster-card ${selectedClusterId === Number(id) ? 'selected' : ''}`}
                        onClick={() => onSelectCluster(Number(id))}
                    >
                        <h3>{cluster.cluster_name}</h3>
                        <div className="cluster-stats">
                            <div className="stat">
                                <span className="stat-label">Customers:</span>
                                <span className="stat-value">{cluster.customer_count}</span>
                            </div>
                            <div className="stat">
                                <span className="stat-label">Avg Age:</span>
                                <span className="stat-value">{cluster.stats.avg_age.toFixed(1)}</span>
                            </div>
                            <div className="stat">
                                <span className="stat-label">Avg Premium:</span>
                                <span className="stat-value">${cluster.stats.avg_premium.toFixed(2)}</span>
                            </div>
                            <div className="stat">
                                <span className="stat-label">Accidents:</span>
                                <span className="stat-value">{cluster.stats.avg_accidents.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ClusterSelector; 