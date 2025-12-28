import React from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { X, Moon, Sun, Smartphone, Grid, Maximize, Shield, Layers } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const SettingsModal = ({ isOpen, onClose }) => {
    const { settings, updateSettings } = useSettings();

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', zIndex: 1000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
            >
                <motion.div
                    className="settings-modal"
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        background: 'var(--color-bg)', padding: '2rem', borderRadius: '1rem',
                        width: '90%', maxWidth: '400px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                    }}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="settings-title"
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 id="settings-title" style={{ margin: 0 }}>Settings</h2>
                        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }} aria-label="Close Settings">
                            <X size={24} aria-hidden="true" />
                        </button>
                    </div>

                    <div className="setting-group" style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '0.9rem', opacity: 0.7, marginBottom: '0.5rem' }}>Appearance</h3>
                        <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(0,0,0,0.05)', padding: '4px', borderRadius: '8px' }}>
                            {['light', 'system', 'dark'].map((theme) => (
                                <button
                                    key={theme}
                                    onClick={() => updateSettings({ theme })}
                                    style={{
                                        flex: 1, border: 'none', padding: '8px', borderRadius: '6px',
                                        background: settings.theme === theme ? 'white' : 'transparent',
                                        boxShadow: settings.theme === theme ? '0 2px 5px rgba(0,0,0,0.1)' : 'none',
                                        cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center'
                                    }}
                                    aria-label={`Select ${theme} theme`}
                                    aria-pressed={settings.theme === theme}
                                >
                                    {theme === 'light' && <Sun size={18} aria-hidden="true" />}
                                    {theme === 'system' && <Smartphone size={18} aria-hidden="true" />}
                                    {theme === 'dark' && <Moon size={18} aria-hidden="true" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="setting-group" style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '0.9rem', opacity: 0.7, marginBottom: '0.5rem' }}>Grid Density</h3>
                        <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(0,0,0,0.05)', padding: '4px', borderRadius: '8px' }}>
                            {['comfortable', 'compact'].map((density) => (
                                <button
                                    key={density}
                                    onClick={() => updateSettings({ gridDensity: density })}
                                    style={{
                                        flex: 1, border: 'none', padding: '8px', borderRadius: '6px',
                                        background: settings.gridDensity === density ? 'white' : 'transparent',
                                        boxShadow: settings.gridDensity === density ? '0 2px 5px rgba(0,0,0,0.1)' : 'none',
                                        cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    {density === 'comfortable' ? <Grid size={18} /> : <Maximize size={18} />}
                                    <span style={{ textTransform: 'capitalize' }}>{density}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="setting-group">
                        <h3 style={{ fontSize: '0.9rem', opacity: 0.7, marginBottom: '0.5rem' }}>Advanced</h3>
                        <div
                            onClick={() => updateSettings({ expertMode: !settings.expertMode })}
                            style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '12px', borderRadius: '8px', cursor: 'pointer',
                                background: settings.expertMode ? 'rgba(76, 175, 80, 0.1)' : 'rgba(0,0,0,0.03)',
                                border: settings.expertMode ? '1px solid #4CAF50' : '1px solid transparent'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Shield size={20} color={settings.expertMode ? '#4CAF50' : 'gray'} />
                                <div>
                                    <div style={{ fontWeight: 500 }}>Expert Mode</div>
                                    <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Enable raw data & hidden options</div>
                                </div>
                            </div>
                            <div style={{
                                width: '40px', height: '22px', background: settings.expertMode ? '#4CAF50' : '#ccc',
                                borderRadius: '11px', position: 'relative', transition: 'background 0.3s'
                            }}>
                                <div style={{
                                    width: '18px', height: '18px', background: 'white', borderRadius: '50%',
                                    position: 'absolute', top: '2px', left: settings.expertMode ? '20px' : '2px',
                                    transition: 'left 0.3s'
                                }} />
                            </div>
                        </div>
                    </div>

                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default SettingsModal;
