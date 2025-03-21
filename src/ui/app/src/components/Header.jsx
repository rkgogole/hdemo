import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

function Header() {
    const { darkMode, toggleDarkMode } = useAppContext();

    return (
        <header className="header">
            <div className="logo">
                <h1>Smart Segmentation</h1>
            </div>
            <nav className="nav">
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/dashboard">Dashboard</Link></li>
                </ul>
            </nav>
            <button
                className="theme-toggle"
                onClick={toggleDarkMode}
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
                {darkMode ? '☀️' : '🌙'}
            </button>
        </header>
    );
}

export default Header; 