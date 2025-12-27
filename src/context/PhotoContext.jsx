import React, { createContext, useState, useContext, useEffect } from 'react';

const PhotoContext = createContext(null);

const DEFAULT_PHOTOS = [
    { id: 1, url: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1000&auto=format&fit=crop', title: 'Holiday Memories', size: 'large' },
    { id: 2, url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1000&auto=format&fit=crop', title: 'Sunday Walk', size: 'medium' },
    { id: 3, url: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?q=80&w=1000&auto=format&fit=crop', title: 'Beach Day', size: 'tall' },
    { id: 4, url: 'https://images.unsplash.com/photo-1494774158161-d69501da6f8d?q=80&w=1000&auto=format&fit=crop', title: 'Together', size: 'wide' },
    { id: 5, url: 'https://images.unsplash.com/photo-1506543730535-7c323386616a?q=80&w=1000&auto=format&fit=crop', title: 'Little One', size: 'medium' },
    { id: 6, url: 'https://images.unsplash.com/photo-1529156069898-1d04b3417e31?q=80&w=1000&auto=format&fit=crop', title: 'Joy', size: 'tall' },
    { id: 7, url: 'https://images.unsplash.com/photo-1536640712-4d4c36ff0e4e?q=80&w=1000&auto=format&fit=crop', title: 'Adventures', size: 'wide' },
    { id: 8, url: 'https://images.unsplash.com/photo-1595295425007-6060c5a3b2b8?q=80&w=1000&auto=format&fit=crop', title: 'Picnic', size: 'medium' },
];

export const PhotoProvider = ({ children }) => {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load from local storage
        const storedPhotos = localStorage.getItem('familyPhotos');
        if (storedPhotos) {
            try {
                setPhotos(JSON.parse(storedPhotos));
            } catch (e) {
                console.error("Failed to parse photos", e);
                setPhotos(DEFAULT_PHOTOS);
            }
        } else {
            setPhotos(DEFAULT_PHOTOS);
        }
        setLoading(false);
    }, []);

    const saveToStorage = (newPhotos) => {
        localStorage.setItem('familyPhotos', JSON.stringify(newPhotos));
    };

    const addPhoto = (photoData) => {
        const newPhoto = {
            id: Date.now(), // Simple ID generation
            ...photoData
        };
        const updatedPhotos = [newPhoto, ...photos];
        setPhotos(updatedPhotos);
        saveToStorage(updatedPhotos);
    };

    const removePhoto = (id) => {
        const updatedPhotos = photos.filter(p => p.id !== id);
        setPhotos(updatedPhotos);
        saveToStorage(updatedPhotos);
    };

    return (
        <PhotoContext.Provider value={{ photos, addPhoto, removePhoto, loading }}>
            {!loading && children}
        </PhotoContext.Provider>
    );
};

export const usePhotos = () => useContext(PhotoContext);
