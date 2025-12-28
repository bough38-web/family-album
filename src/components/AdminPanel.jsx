import React, { useState } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Trash2, Save, X, CheckSquare, Square, Edit2 } from 'lucide-react';
import { usePhotos } from '../context/PhotoContext';

import AdminResetForm from './AdminResetForm';
import EditPhotoModal from './EditPhotoModal';
import { useSettings } from '../context/SettingsContext';
import './AdminPanel.css';

const AdminPanel = () => {
    const [uploads, setUploads] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const { photos, addPhoto, removePhoto, updatePhoto } = usePhotos();
    const { settings } = useSettings();

    // Edit Mode State
    const [editingPhoto, setEditingPhoto] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Expert Mode: Multi-select state
    const [selectedPhotos, setSelectedPhotos] = useState([]);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        handleFiles(files);
    };

    const handleFiles = (files) => {
        const newUploads = files.map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            file,
            url: URL.createObjectURL(file),
            // Default metadata
            name: file.name.split('.')[0],
            date: new Date().toISOString().split('T')[0],
            caption: '',
            size: 'medium'
        }));
        setUploads([...uploads, ...newUploads]);
    };

    const updateUploadData = (id, field, value) => {
        setUploads(uploads.map(u => u.id === id ? { ...u, [field]: value } : u));
    };

    const removeUpload = (id) => {
        setUploads(uploads.filter(u => u.id !== id));
    };

    const handleSave = () => {
        if (uploads.length === 0) return;

        let processedCount = 0;
        uploads.forEach(upload => {
            const reader = new FileReader();
            reader.onloadend = () => {
                addPhoto({
                    title: upload.name,
                    url: reader.result,
                    size: upload.size,
                    date: upload.date,
                    comments: upload.caption ? [{
                        id: Date.now(),
                        text: upload.caption,
                        date: new Date().toISOString()
                    }] : []
                });

                processedCount++;
                if (processedCount === uploads.length) {
                    setUploads([]);
                    alert("All photos saved successfully!");
                }
            };
            reader.readAsDataURL(upload.file);
        });
    };

    // Expert Mode: Bulk Actions
    const togglePhotoSelection = (id) => {
        if (selectedPhotos.includes(id)) {
            setSelectedPhotos(selectedPhotos.filter(pid => pid !== id));
        } else {
            setSelectedPhotos([...selectedPhotos, id]);
        }
    };

    const handleBulkDelete = () => {
        if (!window.confirm(`Delete ${selectedPhotos.length} photos?`)) return;
        selectedPhotos.forEach(id => removePhoto(id));
        setSelectedPhotos([]);
    };

    const openEditModal = (photo) => {
        setEditingPhoto(photo);
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = (id, updatedData) => {
        updatePhoto(id, updatedData);
        setIsEditModalOpen(false);
        setEditingPhoto(null);
    };

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1>Photo Management</h1>
                <p>Upload new memories to the family album.</p>
                {settings.expertMode && (
                    <div className="expert-badge">Expert Mode Active</div>
                )}
            </div>

            <div className="admin-content">
                {/* Upload Zone */}
                <div
                    className={`upload-zone ${isDragging ? 'dragging' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        id="file-input"
                        style={{ display: 'none' }}
                        onChange={handleFileSelect}
                        aria-label="File Upload Input"
                    />
                    <label htmlFor="file-input" className="upload-label" role="button" tabIndex="0">
                        <Upload size={48} className="upload-icon" />
                        <h3>Drag & Drop photos here</h3>
                        <p>or click to browse</p>
                    </label>
                </div>

                {/* Draft Editor */}
                <AnimatePresence>
                    {uploads.length > 0 && (
                        <motion.div
                            className="draft-editor-section"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            <div className="section-title-row">
                                <h3>Draft Editor ({uploads.length})</h3>
                                <button className="save-btn" onClick={handleSave}>
                                    <Save size={18} />
                                    Publish All
                                </button>
                            </div>

                            <div className="draft-list" role="list">
                                {uploads.map((upload) => (
                                    <div key={upload.id} className="draft-item">
                                        <div className="draft-preview">
                                            <img src={upload.url} alt="preview" loading="lazy" />
                                            <button className="remove-draft-btn" onClick={() => removeUpload(upload.id)} aria-label="Remove draft">
                                                <X size={16} aria-hidden="true" />
                                            </button>
                                        </div>
                                        <div className="draft-details">
                                            <div className="form-group">
                                                <label>Title</label>
                                                <input
                                                    type="text"
                                                    value={upload.name}
                                                    onChange={(e) => updateUploadData(upload.id, 'name', e.target.value)}
                                                />
                                            </div>
                                            <div className="form-group row">
                                                <div style={{ flex: 1 }}>
                                                    <label>Date</label>
                                                    <input
                                                        type="date"
                                                        value={upload.date}
                                                        onChange={(e) => updateUploadData(upload.id, 'date', e.target.value)}
                                                    />
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <label>Size</label>
                                                    <select
                                                        value={upload.size}
                                                        onChange={(e) => updateUploadData(upload.id, 'size', e.target.value)}
                                                    >
                                                        <option value="medium">Medium</option>
                                                        <option value="wide">Wide</option>
                                                        <option value="tall">Tall</option>
                                                        <option value="large">Large</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label>Caption / First Comment</label>
                                                <textarea
                                                    rows="2"
                                                    value={upload.caption}
                                                    onChange={(e) => updateUploadData(upload.id, 'caption', e.target.value)}
                                                    placeholder="Add a sweet memory..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Existing Gallery */}
                {/* Admin Password Reset Section */}
                <div className="admin-reset-section" style={{ marginTop: '2rem' }}>
                    <h3>Reset User Password (Admin)</h3>
                    <AdminResetForm />
                </div>
                <div className="existing-photos">
                    <div className="section-title-row">
                        <h3>Gallery ({photos.length})</h3>
                        {settings.expertMode && selectedPhotos.length > 0 && (
                            <button className="delete-selected-btn" onClick={handleBulkDelete}>
                                <Trash2 size={16} />
                                Delete ({selectedPhotos.length})
                            </button>
                        )}
                    </div>

                    <div className="preview-grid">
                        {photos.map((photo) => (
                            <div
                                key={photo.id}
                                className={`existing-item ${selectedPhotos.includes(photo.id) ? 'selected' : ''}`}
                                onClick={() => settings.expertMode && togglePhotoSelection(photo.id)}
                            >
                                <img src={photo.url} alt={photo.title} loading="lazy" />
                                <div className="item-info">
                                    <span>{photo.title}</span>
                                </div>

                                {settings.expertMode ? (
                                    <div className="selection-overlay">
                                        {selectedPhotos.includes(photo.id) ?
                                            <CheckSquare className="check-icon" size={24} /> :
                                            <Square className="check-icon" size={24} />
                                        }
                                    </div>
                                ) : (
                                    <div className="action-buttons" style={{ display: 'flex', gap: '8px' }}>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openEditModal(photo);
                                            }}
                                            className="edit-btn-single"
                                            style={{
                                                background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%',
                                                width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                                            }}
                                            aria-label={`Edit photo ${photo.title}`}
                                        >
                                            <Edit2 size={14} color="#333" aria-hidden="true" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (window.confirm('Delete this photo?')) removePhoto(photo.id);
                                            }}
                                            className="delete-btn-single"
                                            aria-label={`Delete photo ${photo.title}`}
                                        >
                                            <Trash2 size={14} aria-hidden="true" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <EditPhotoModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                photo={editingPhoto}
                onSave={handleSaveEdit}
            />
        </div >
    );
};

export default AdminPanel;
