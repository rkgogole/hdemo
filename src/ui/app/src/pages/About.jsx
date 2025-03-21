import React from 'react';

function About() {
    return (
        <div className="about-page">
            <h1>About Smart Segmentation</h1>

            <section className="about-section">
                <h2>Our Mission</h2>
                <p>
                    At Smart Segmentation, we're dedicated to making data analysis accessible and
                    actionable for everyone. Our platform combines cutting-edge AI with intuitive
                    design to help you unlock the full potential of your data.
                </p>
            </section>

            <section className="about-section">
                <h2>The Team</h2>
                <div className="team-grid">
                    <div className="team-member">
                        <div className="avatar placeholder"></div>
                        <h3>Jane Doe</h3>
                        <p>Founder & CEO</p>
                    </div>
                    <div className="team-member">
                        <div className="avatar placeholder"></div>
                        <h3>John Smith</h3>
                        <p>CTO</p>
                    </div>
                    <div className="team-member">
                        <div className="avatar placeholder"></div>
                        <h3>Emily Johnson</h3>
                        <p>Lead Data Scientist</p>
                    </div>
                </div>
            </section>

            <section className="about-section">
                <h2>Our Technology</h2>
                <p>
                    Smart Segmentation uses a combination of machine learning algorithms,
                    statistical analysis, and data visualization techniques to provide
                    powerful insights from your data.
                </p>
            </section>
        </div>
    );
}

export default About; 