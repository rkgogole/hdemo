import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

function Dashboard() {
    const { userData, isLoading, setIsLoading } = useAppContext();
    const [segments, setSegments] = useState([]);

    useEffect(() => {
        // Simulate fetching data
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Mock data
                setSegments([
                    { id: 1, name: 'High Value Customers', count: 1250, growth: 5.2 },
                    { id: 2, name: 'New Users', count: 3427, growth: 12.7 },
                    { id: 3, name: 'Churning Risk', count: 567, growth: -2.3 },
                    { id: 4, name: 'Potential Upsell', count: 890, growth: 7.8 }
                ]);
            } catch (error) {
                console.error('Error fetching segments:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [setIsLoading]);

    if (isLoading) {
        return <div className="loading">Loading dashboard data...</div>;
    }

    return (
        <div className="dashboard-page">
            <h1>Your Segmentation Dashboard</h1>

            <div className="dashboard-summary">
                <div className="summary-card">
                    <h3>Total Segments</h3>
                    <p className="summary-value">{segments.length}</p>
                </div>
                <div className="summary-card">
                    <h3>Total Records</h3>
                    <p className="summary-value">
                        {segments.reduce((sum, segment) => sum + segment.count, 0).toLocaleString()}
                    </p>
                </div>
            </div>

            <section className="segments-section">
                <h2>Your Segments</h2>
                <div className="segments-grid">
                    {segments.map(segment => (
                        <div key={segment.id} className="segment-card">
                            <h3>{segment.name}</h3>
                            <p className="segment-count">{segment.count.toLocaleString()} users</p>
                            <p className={`segment-growth ${segment.growth >= 0 ? 'positive' : 'negative'}`}>
                                {segment.growth >= 0 ? '↑' : '↓'} {Math.abs(segment.growth)}%
                            </p>
                            <button className="secondary-button">View Details</button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default Dashboard; 