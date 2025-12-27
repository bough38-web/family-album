import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X } from 'lucide-react';
import { usePhotos } from '../context/PhotoContext';
import './PhotoGrid.css';

const PhotoGrid = () => {
    const [selectedId, setSelectedId] = useState(null);
    const { photos } = usePhotos();

    return (
        <section className="gallery-section">
            <div className="section-header">
                <h2>Captured Moments</h2>
                <p>A glimpse into our daily happiness.</p>
            </div>

            <div className="photo-grid">
                {photos.map((photo) => (
                    <motion.div
                        key={photo.id}
                        layoutId={`photo-${photo.id}`}
                        className={`photo-item ${photo.size}`}
                        whileHover={{ scale: 1.02, y: -5 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        onClick={() => setSelectedId(photo.id)}
                    >
                        <img src={photo.url} alt={photo.title} loading="lazy" />
                        <div className="photo-overlay">
                            <span>{photo.title}</span>
                            <Maximize2 size={20} />
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {selectedId && (
                    <motion.div
                        className="lightbox-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedId(null)}
                    >
                        <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                            <motion.img
                                layoutId={`photo-${selectedId}`}
                                src={photos.find(p => p.id === selectedId)?.url}
                                alt="Full View"
                            />
                            <button className="close-btn" onClick={() => setSelectedId(null)}>
                                <X size={24} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default PhotoGrid;
