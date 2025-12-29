import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Upload } from 'lucide-react';
import './EditPhotoModal.css';

const EditPhotoModal = ({ isOpen, onClose, photo, onSave }) => {
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        size: 'medium',
        caption: '',
        url: ''
    });

    useEffect(() => {
        if (photo) {
            setFormData({
                title: photo.title || '',
                date: photo.date || '',
                size: photo.size || 'medium',
                caption: photo.comments && photo.comments[0] ? photo.comments[0].text : '',
                url: photo.url || ''
            });
        }
    }, [photo]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, url: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(photo.id, {
            ...formData,
            comments: photo.comments && photo.comments.length > 0
                ? photo.comments.map((c, i) => i === 0 ? { ...c, text: formData.caption } : c)
                : formData.caption ? [{ id: Date.now(), text: formData.caption, date: new Date().toISOString() }] : []
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="edit-modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="edit-modal-content"
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="edit-photo-title"
                >
                    <div className="edit-modal-header">
                        <h2 id="edit-photo-title">Edit Photo</h2>
                        <button onClick={onClose} className="close-button" aria-label="Close">
                            <X size={24} aria-hidden="true" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="edit-modal-form">
                        {/* Image Preview & Change */}
                        <div className="image-preview-section">
                            <img
                                src={formData.url}
                                alt="Preview"
                                className="preview-image"
                            />
                            <div className="file-input-wrapper">
                                <input
                                    type="file"
                                    accept="image/*"
                                    id="edit-file-input"
                                    style={{ display: 'none' }}
                                    onChange={handleFileChange}
                                />
                                <label
                                    htmlFor="edit-file-input"
                                    className="file-input-label"
                                >
                                    <Upload size={16} /> Change Photo
                                </label>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="form-input"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Size</label>
                                <select
                                    name="size"
                                    value={formData.size}
                                    onChange={handleChange}
                                    className="form-select"
                                >
                                    <option value="medium">Medium</option>
                                    <option value="wide">Wide</option>
                                    <option value="tall">Tall</option>
                                    <option value="large">Large</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Caption</label>
                            <textarea
                                name="caption"
                                value={formData.caption}
                                onChange={handleChange}
                                rows="3"
                                className="form-textarea"
                            />
                        </div>

                        <div className="modal-actions">
                            <button
                                type="button"
                                onClick={onClose}
                                className="btn-cancel"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn-save"
                            >
                                <Save size={18} /> Save Changes
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default EditPhotoModal;

