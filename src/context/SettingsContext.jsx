/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { get, set } from 'idb-keyval';

const SettingsContext = createContext(null);

const DEFAULT_SETTINGS = {
    theme: 'system', // 'light', 'dark', 'system'
    gridDensity: 'comfortable', // 'compact', 'comfortable'
    expertMode: false,
};

export const SettingsProvider = ({ children }) => {
    const [settings, setSettingsState] = useState(DEFAULT_SETTINGS);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const storedSettings = await get('appSettings');
                if (storedSettings) {
                    setSettingsState({ ...DEFAULT_SETTINGS, ...storedSettings });
                }
            } catch (err) {
                console.error("Failed to load settings:", err);
            } finally {
                setLoading(false);
            }
        };
        loadSettings();
    }, []);

    const updateSettings = (newSettings) => {
        const updated = { ...settings, ...newSettings };
        setSettingsState(updated);
        set('appSettings', updated).catch(err => console.error("Failed to save settings:", err));

        // Apply theme side-effect
        if (newSettings.theme) {
            applyTheme(newSettings.theme);
        }
    };

    // Initial theme application
    useEffect(() => {
        if (!loading) {
            applyTheme(settings.theme);
        }
    }, [loading, settings.theme]);

    const applyTheme = (theme) => {
        const root = window.document.documentElement;
        const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

        if (isDark) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSettings, loading }}>
            {!loading && children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => useContext(SettingsContext);
