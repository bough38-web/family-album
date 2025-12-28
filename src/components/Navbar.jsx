import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SettingsModal from './SettingsModal';
import './Navbar.css';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const location = useLocation();
    const { logout } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { title: 'Home', path: '/' },
        { title: 'Gallery', path: '/gallery' },
        { title: 'Timeline', path: '/timeline' },
        { title: 'About', path: '/about' },
        { title: 'Admin', path: '/admin' },
    ];

    return (
        <>
            <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
                <div className="nav-container">
                    <Link to="/" className="nav-logo">
                        <Heart className="logo-icon" size={24} fill="currentColor" />
                        <span className="logo-text">Our Family</span>
                    </Link>

                    <div className="nav-links-desktop">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                            >
                                {link.title}
                            </Link>
                        ))}
                        <button onClick={() => setIsSettingsOpen(true)} className="nav-link settings-btn" aria-label="Settings">
                            <Settings size={18} aria-hidden="true" />
                        </button>
                        <button onClick={logout} className="nav-link logout-btn" aria-label="Logout">
                            <LogOut size={18} aria-hidden="true" />
                        </button>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        {/* Mobile Settings Button */}
                        <button
                            className="mobile-menu-btn"
                            style={{ marginRight: 0 }}
                            onClick={() => setIsSettingsOpen(true)}
                            aria-label="Open Settings"
                        >
                            <Settings size={20} aria-hidden="true" />
                        </button>

                        <button
                            className="mobile-menu-btn"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label={isMobileMenuOpen ? "Close Menu" : "Open Menu"}
                            aria-expanded={isMobileMenuOpen}
                        >
                            {isMobileMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
                        </button>
                    </div>
                </div>

                {isMobileMenuOpen && (
                    <div className="mobile-menu-dropdown">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className="mobile-nav-link"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.title}
                            </Link>
                        ))}
                    </div>
                )}
            </nav>
            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        </>
    );
};

export default Navbar;
