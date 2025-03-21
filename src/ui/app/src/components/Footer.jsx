import React from 'react';

function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="footer">
            <p>© {year} Smart Segmentation. All rights reserved.</p>
        </footer>
    );
}

export default Footer; 