import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X, Heart } from 'lucide-react';
import { usePhotos } from '../context/PhotoContext';
import './PhotoGrid.css';

const PhotoGrid = () => {
    const [selectedId, setSelectedId] = useState(null);
    const { photos, toggleLike, addComment } = usePhotos();
    const [commentText, setCommentText] = useState("");

    const selectedPhoto = photos.find(p => p.id === selectedId);

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (commentText.trim()) {
            addComment(selectedId, commentText);
            setCommentText("");
        }
    };

    return (
        <section className="gallery-section">
            <div className="section-header">
                <h2>Captured Moments</h2>
                <p>소중한 일상의 기록들</p>
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
                            <div className="overlay-stats">
                                <Heart size={16} fill="white" className="heart-icon-sm" />
                                <span>{photo.likes || 0}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {selectedId && selectedPhoto && (
                    <motion.div
                        className="lightbox-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedId(null)}
                    >
                        <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
                            <div className="lightbox-image-wrapper">
                                <motion.img
                                    layoutId={`photo-${selectedId}`}
                                    src={selectedPhoto.url}
                                    alt="Full View"
                                />
                            </div>

                            <div className="lightbox-sidebar">
                                <div className="sidebar-header">
                                    <h3>{selectedPhoto.title}</h3>
                                    <button className="close-btn-static" onClick={() => setSelectedId(null)}>
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="stats-row">
                                    <button className="like-btn-large" onClick={() => toggleLike(selectedId)}>
                                        <Heart
                                            size={24}
                                            fill={selectedPhoto.likes > 0 ? "#ff4757" : "none"}
                                            color={selectedPhoto.likes > 0 ? "#ff4757" : "currentColor"}
                                        />
                                        <span>{selectedPhoto.likes || 0} Likes</span>
                                    </button>
                                </div>

                                <div className="comments-list">
                                    {selectedPhoto.comments && selectedPhoto.comments.length > 0 ? (
                                        selectedPhoto.comments.map(comment => (
                                            <div key={comment.id} className="comment-item">
                                                <p className="comment-text">{comment.text}</p>
                                                <span className="comment-date">
                                                    {new Date(comment.date).toLocaleDateString()}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="no-comments">첫 번째 댓글을 남겨주세요!</p>
                                    )}
                                </div>

                                <form className="comment-form" onSubmit={handleCommentSubmit}>
                                    <input
                                        type="text"
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        placeholder="댓글 남기기..."
                                    />
                                    <button type="submit" disabled={!commentText.trim()}>
                                        등록
                                    </button>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default PhotoGrid;
