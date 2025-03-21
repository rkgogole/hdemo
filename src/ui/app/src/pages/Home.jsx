import React from 'react';
import { useAppContext } from '../context/AppContext';

function Home() {
    const { isLoading } = useAppContext();

    return (
        <div className="home-page">
            <h1>Welcome to Smart Segmentation</h1>
            <p>A powerful tool for intelligent data segmentation and analysis.</p>

            <section className="features">
                <h2>Key Features</h2>
                <div className="feature-grid">
                    <div className="feature-card">
                        <h3>Intelligent Segmentation</h3>
                        <p>Automatically segment your data using advanced algorithms.</p>
                    </div>
                    <div className="feature-card">
                        <h3>Real-time Analysis</h3>
                        <p>Get instant insights from your segmented data.</p>
                    </div>
                    <div className="feature-card">
                        <h3>Interactive Visualizations</h3>
                        <p>Explore your data through beautiful, interactive charts.</p>
                    </div>
                </div>
            </section>

            <section className="cta">
                <h2>Ready to get started?</h2>
                <button className="primary-button">Try it now</button>
            </section>
        </div>
    );
}

export default Home; 