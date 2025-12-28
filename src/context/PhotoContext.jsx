/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useEffect } from 'react';
import { get, set } from 'idb-keyval';

const PhotoContext = createContext(null);

const DEFAULT_PHOTOS = [
    {
        id: 1,
        url: 'https://images.unsplash.com/photo-1596727147705-001d009268f7?q=80&w=1000&auto=format&fit=crop',
        title: '첫 번째 생일 (First Birthday)',
        size: 'large',
        likes: 12,
        comments: [
            { id: 101, text: "너무 귀엽다! 축하해~", date: "2024-03-15T10:00:00Z" },
            { id: 102, text: "돌잡이 뭐 잡았어?", date: "2024-03-15T10:05:00Z" }
        ]
    },
    {
        id: 2,
        url: 'https://images.unsplash.com/photo-1544211181-43202157579c?q=80&w=1000&auto=format&fit=crop',
        title: '가족 여행 (Family Trip)',
        size: 'medium',
        likes: 8,
        comments: []
    },
    {
        id: 3,
        url: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=1000&auto=format&fit=crop',
        title: '함께 걷는 길 (Walking Together)',
        size: 'tall',
        likes: 15,
        comments: [{ id: 103, text: "보기 좋은 뒷모습 ^^", date: "2024-04-20T14:30:00Z" }]
    },
    {
        id: 4,
        url: 'https://images.unsplash.com/photo-1510526027014-da9826388e40?q=80&w=1000&auto=format&fit=crop',
        title: '행복한 저녁 (Happy Dinner)',
        size: 'wide',
        likes: 5,
        comments: []
    },
    {
        id: 5,
        url: 'https://images.unsplash.com/photo-1581404917879-53e19259fdda?q=80&w=1000&auto=format&fit=crop',
        title: '우리 아이 (My Little One)',
        size: 'medium',
        likes: 24,
        comments: []
    },
    {
        id: 6,
        url: 'https://images.unsplash.com/photo-1610216705422-caa3fcb6d158?q=80&w=1000&auto=format&fit=crop',
        title: '봄나들이 (Spring Picnic)',
        size: 'tall',
        likes: 7,
        comments: []
    },
    {
        id: 7,
        url: 'https://images.unsplash.com/photo-1512130325492-9c12b8474d2b?q=80&w=1000&auto=format&fit=crop',
        title: '소중한 순간 (Precious Moment)',
        size: 'wide',
        likes: 19,
        comments: []
    },
    {
        id: 8,
        url: 'https://images.unsplash.com/photo-1476703993279-415558bc6892?q=80&w=1000&auto=format&fit=crop',
        title: '자연 속에서 (In Nature)',
        size: 'medium',
        likes: 3,
        comments: []
    },
];

export const PhotoProvider = ({ children }) => {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPhotos = async () => {
            try {
                const storedPhotos = await get('familyPhotos');
                if (storedPhotos) {
                    setPhotos(storedPhotos);
                } else {
                    setPhotos(DEFAULT_PHOTOS);
                    // Save default immediately so next reload keeps them
                    await set('familyPhotos', DEFAULT_PHOTOS);
                }
            } catch (err) {
                console.error("Failed to load photos from IDB:", err);
                setPhotos(DEFAULT_PHOTOS);
            } finally {
                setLoading(false);
            }
        };
        loadPhotos();
    }, []);

    const saveToStorage = async (newPhotos) => {
        try {
            await set('familyPhotos', newPhotos);
        } catch (err) {
            console.error("Failed to save photos to IDB:", err);
        }
    };

    const addPhoto = (photoData) => {
        const newPhoto = {
            id: Date.now(),
            likes: 0,
            comments: [],
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

    const toggleLike = (id) => {
        const updatedPhotos = photos.map(photo => {
            if (photo.id === id) {
                return { ...photo, likes: (photo.likes || 0) + 1 };
            }
            return photo;
        });
        setPhotos(updatedPhotos);
        saveToStorage(updatedPhotos);
    };

    const addComment = (id, text) => {
        const updatedPhotos = photos.map(photo => {
            if (photo.id === id) {
                const newComment = {
                    id: Date.now(),
                    text,
                    date: new Date().toISOString()
                };
                return { ...photo, comments: [...(photo.comments || []), newComment] };
            }
            return photo;
        });
        setPhotos(updatedPhotos);
        saveToStorage(updatedPhotos);
    };

    return (
        <PhotoContext.Provider value={{ photos, addPhoto, removePhoto, toggleLike, addComment, loading }}>
            {!loading && children}
        </PhotoContext.Provider>
    );
};

export const usePhotos = () => useContext(PhotoContext);
