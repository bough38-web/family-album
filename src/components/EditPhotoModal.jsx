import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Upload } from 'lucide-react';

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
            // If caption changed, we might need to update the first comment or add a new one?
            // For simplicity, let's assume we are editing the "caption" which acts as the first comment or description.
            // If the original photo has comments, we update the first one's text if it exists, or create one.
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
                className="modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', zIndex: 1100,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
            >
                <motion.div
                    className="modal-content"
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        background: 'var(--color-bg)', padding: '2rem', borderRadius: '1rem',
                        width: '90%', maxWidth: '500px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                        maxHeight: '90vh', overflowY: 'auto'
                    }}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="edit-photo-title"
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 id="edit-photo-title" style={{ margin: 0 }}>Edit Photo</h2>
                        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }} aria-label="Close">
                            <X size={24} aria-hidden="true" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {/* Image Preview & Change */}
                        <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
                            <img
                                src={formData.url}
                                alt="Preview"
                                style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', objectFit: 'cover' }}
                            />
                            <div style={{ marginTop: '0.5rem' }}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    id="edit-file-input"
                                    style={{ display: 'none' }}
                                    onChange={handleFileChange}
                                />
                                <label
                                    htmlFor="edit-file-input"
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                                        padding: '8px 16px', borderRadius: '6px',
                                        border: '1px solid var(--color-border)', cursor: 'pointer',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    <Upload size={16} /> Change Photo
                                </label>
                            </div>
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                                />
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Size</label>
                                <select
                                    name="size"
                                    value={formData.size}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                                >
                                    <option value="medium">Medium</option>
                                    <option value="wide">Wide</option>
                                    <option value="tall">Tall</option>
                                    <option value="large">Large</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Caption</label>
                            <textarea
                                name="caption"
                                value={formData.caption}
                                onChange={handleChange}
                                rows="3"
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                            />
                        </div>

                        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                            <button
                                type="button"
                                onClick={onClose}
                                style={{
                                    padding: '10px 20px', borderRadius: '6px', border: 'none',
                                    background: 'rgba(0,0,0,0.05)', cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                style={{
                                    padding: '10px 20px', borderRadius: '6px', border: 'none',
                                    background: 'var(--color-text)', color: 'var(--color-bg)',
                                    fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
                                }}
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
