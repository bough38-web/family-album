import React from 'react';

const Footer = () => {
    return (
        <footer style={{
            padding: '3rem 0',
            textAlign: 'center',
            borderTop: '1px solid var(--glass-border)',
            background: 'var(--bg-secondary)',
            marginTop: 'auto',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-serif)'
        }}>
            <p style={{ marginBottom: '0.5rem' }}>&copy; {new Date().getFullYear()} Our Family Album</p>
            <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>Created with Love</p>
        </footer>
    );
};

export default Footer;
