import React, { createContext, useContext, useState, useEffect } from 'react';
import { get, set } from 'idb-keyval';

const ContentContext = createContext(null);

const DEFAULT_HERO = {
    title: "Cherished Moments",
    subtitle: "평범한 하루가 가장 아름다운 이야기입니다.\n우리의 소중한 추억을 영원히 간직하세요.",
    image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=2070&auto=format&fit=crop"
};

const DEFAULT_TIMELINE = [
    { id: 1, date: '2025-12-25', title: 'Christmas Dinner', desc: 'A wonderful evening with everyone gathered around the table.', img: 'https://images.unsplash.com/photo-1576824228987-a3d8df8d4360?q=80&w=800&auto=format&fit=crop' },
    { id: 2, date: '2025-11-15', title: 'Autumn Hike', desc: 'The mountains were golden. Dad made it to the peak!', img: 'https://images.unsplash.com/photo-1445778235210-9b4344d5a92a?q=80&w=800&auto=format&fit=crop' },
    { id: 3, date: '2025-09-02', title: 'Back to School', desc: 'First day for the little ones. They were so excited.', img: 'https://images.unsplash.com/photo-1427504746696-ea5abd7dfe33?q=80&w=800&auto=format&fit=crop' },
    { id: 4, date: '2025-07-20', title: 'Summer Vacation', desc: 'Jeju Island trip. The sunset was unforgettable.', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop' },
];

export const ContentProvider = ({ children }) => {
    const [heroContent, setHeroContent] = useState(DEFAULT_HERO);
    const [timelineEvents, setTimelineEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadContent = async () => {
            try {
                const storedHero = await get('heroContent');
                if (storedHero) setHeroContent(storedHero);

                const storedTimeline = await get('timelineEvents');
                if (storedTimeline) {
                    setTimelineEvents(storedTimeline);
                } else {
                    setTimelineEvents(DEFAULT_TIMELINE);
                    await set('timelineEvents', DEFAULT_TIMELINE);
                }
            } catch (error) {
                console.error("Failed to load content:", error);
            } finally {
                setLoading(false);
            }
        };
        loadContent();
    }, []);

    const updateHero = async (newContent) => {
        const updated = { ...heroContent, ...newContent };
        setHeroContent(updated);
        await set('heroContent', updated);
    };

    const addTimelineEvent = async (event) => {
        const newEvent = { ...event, id: Date.now() };
        const updated = [newEvent, ...timelineEvents];
        // Sort by date descending
        updated.sort((a, b) => new Date(b.date) - new Date(a.date));
        setTimelineEvents(updated);
        await set('timelineEvents', updated);
    };

    const updateTimelineEvent = async (id, updatedData) => {
        const updated = timelineEvents.map(evt =>
            evt.id === id ? { ...evt, ...updatedData } : evt
        );
        updated.sort((a, b) => new Date(b.date) - new Date(a.date));
        setTimelineEvents(updated);
        await set('timelineEvents', updated);
    };

    const deleteTimelineEvent = async (id) => {
        const updated = timelineEvents.filter(evt => evt.id !== id);
        setTimelineEvents(updated);
        await set('timelineEvents', updated);
    };

    return (
        <ContentContext.Provider value={{
            heroContent,
            updateHero,
            timelineEvents,
            addTimelineEvent,
            updateTimelineEvent,
            deleteTimelineEvent,
            loading
        }}>
            {!loading && children}
        </ContentContext.Provider>
    );
};

export const useContent = () => {
    const context = useContext(ContentContext);
    if (!context) {
        throw new Error('useContent must be used within a ContentProvider');
    }
    return context;
};
