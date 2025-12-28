import React, { useState } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Trash2, Save, X, CheckSquare, Square, Edit2, Shield, User, Layout, Calendar, Image as ImageIcon } from 'lucide-react';
import { usePhotos } from '../context/PhotoContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useContent } from '../context/ContentContext';

import AdminResetForm from './AdminResetForm';
import AdminCreateUserForm from './AdminCreateUserForm';
import EditPhotoModal from './EditPhotoModal';
import { useSettings } from '../context/SettingsContext';
import './AdminPanel.css';

const AdminPanel = () => {
    const [uploads, setUploads] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const { photos, addPhoto, removePhoto, updatePhoto } = usePhotos();
    const { settings } = useSettings();
    const { registeredUsers } = useAuth(); // Get registered users
    const { addToast } = useToast();
    const {
        heroContent, updateHero,
        timelineEvents, addTimelineEvent, updateTimelineEvent, deleteTimelineEvent
    } = useContent();

    const [activeTab, setActiveTab] = useState('gallery'); // 'gallery', 'timeline', 'home'

    // Timeline Form State
    const [timelineForm, setTimelineForm] = useState({
        date: '', title: '', desc: '', img: ''
    });
    const [editingEventId, setEditingEventId] = useState(null);

    // Home Form State
    const [heroForm, setHeroForm] = useState({ ...heroContent });

    // Edit Mode State
    const [editingPhoto, setEditingPhoto] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUserForReset, setSelectedUserForReset] = useState(null);

    // Expert Mode: Multi-select state
    const [selectedPhotos, setSelectedPhotos] = useState([]);

    // Search State
    const [searchTerm, setSearchTerm] = useState("");

    const filteredPhotos = photos.filter(photo =>
        photo.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                    addToast("All photos saved successfully!", "success");
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
                <h1>Admin Dashboard</h1>
                <p>Manage your family album content.</p>
                {settings.expertMode && (
                    <div className="expert-badge">Expert Mode Active</div>
                )}
            </div>

            <div className="admin-tabs">
                <button
                    className={`tab-btn ${activeTab === 'gallery' ? 'active' : ''}`}
                    onClick={() => setActiveTab('gallery')}
                >
                    <ImageIcon size={18} /> Gallery
                </button>
                <button
                    className={`tab-btn ${activeTab === 'timeline' ? 'active' : ''}`}
                    onClick={() => setActiveTab('timeline')}
                >
                    <Calendar size={18} /> Timeline
                </button>
                <button
                    className={`tab-btn ${activeTab === 'home' ? 'active' : ''}`}
                    onClick={() => {
                        setActiveTab('home');
                        setHeroForm({ ...heroContent }); // Sync form on tab switch
                    }}
                >
                    <Layout size={18} /> Home Settings
                </button>
            </div>

            <div className="admin-content">
                {activeTab === 'gallery' && (
                    <>
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
                        {/* Admin Password Reset & User Creation Section */}
                        {/* Admin Password Reset & User Creation Section */}
                        <div className="user-management-section">
                            <h3>
                                <Shield size={24} />
                                User Management (Admin)
                            </h3>
                            <div className="user-management-grid">

                                {/* User List */}
                                <div className="user-management-card">
                                    <h4>Registered Users</h4>
                                    <div className="user-list" role="list">
                                        {registeredUsers?.map(u => (
                                            <div key={u.username} className="user-list-item">
                                                <div className="user-info">
                                                    {u.role === 'admin' ? <Shield size={16} className="text-blue-500" /> : <User size={16} className="text-purple-500" />}
                                                    <span>{u.username}</span>
                                                    <span className={`role-badge ${u.role}`}>{u.role}</span>
                                                </div>
                                                <button
                                                    onClick={() => setSelectedUserForReset(u.username)}
                                                    className="action-btn-sm"
                                                >
                                                    Reset
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <AdminResetForm selectedUser={selectedUserForReset} />
                                <AdminCreateUserForm />
                            </div>
                        </div>
                        <div className="existing-photos">
                            <div className="section-title-row">
                                <h3>Gallery ({photos.length})</h3>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div className="search-bar" style={{ position: 'relative' }}>
                                        <input
                                            type="text"
                                            placeholder="Search photos..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            style={{
                                                padding: '6px 12px',
                                                borderRadius: '6px',
                                                border: '1px solid #ddd',
                                                fontSize: '0.9rem',
                                                width: '200px'
                                            }}
                                        />
                                    </div>
                                    {settings.expertMode && selectedPhotos.length > 0 && (
                                        <button className="delete-selected-btn" onClick={handleBulkDelete}>
                                            <Trash2 size={16} />
                                            Delete ({selectedPhotos.length})
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="preview-grid">
                                {filteredPhotos.map((photo) => (
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
            </>
            )}

            {activeTab === 'timeline' && (
                <div className="timeline-management">
                    <div className="admin-card">
                        <h3>{editingEventId ? 'Edit Event' : 'Add New Event'}</h3>
                        <div className="form-grid">
                            <input
                                type="date"
                                value={timelineForm.date}
                                onChange={e => setTimelineForm({ ...timelineForm, date: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Title"
                                value={timelineForm.title}
                                onChange={e => setTimelineForm({ ...timelineForm, title: e.target.value })}
                            />
                            <textarea
                                placeholder="Description"
                                value={timelineForm.desc}
                                onChange={e => setTimelineForm({ ...timelineForm, desc: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Image URL (Optional)"
                                value={timelineForm.img}
                                onChange={e => setTimelineForm({ ...timelineForm, img: e.target.value })}
                            />
                            <button
                                className="save-btn"
                                onClick={() => {
                                    if (editingEventId) {
                                        updateTimelineEvent(editingEventId, timelineForm);
                                        setEditingEventId(null);
                                        addToast('Event updated', 'success');
                                    } else {
                                        addTimelineEvent(timelineForm);
                                        addToast('Event added', 'success');
                                    }
                                    setTimelineForm({ date: '', title: '', desc: '', img: '' });
                                }}
                            >
                                <Save size={16} /> {editingEventId ? 'Update Event' : 'Add Event'}
                            </button>
                            {editingEventId && (
                                <button className="cancel-btn" onClick={() => {
                                    setEditingEventId(null);
                                    setTimelineForm({ date: '', title: '', desc: '', img: '' });
                                }}>
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="timeline-list">
                        {timelineEvents.map(event => (
                            <div key={event.id} className="timeline-admin-item">
                                <span className="date">{event.date}</span>
                                <div className="content">
                                    <strong>{event.title}</strong>
                                    <p>{event.desc}</p>
                                </div>
                                <div className="actions">
                                    <button onClick={() => {
                                        setEditingEventId(event.id);
                                        setTimelineForm(event);
                                    }}><Edit2 size={16} /></button>
                                    <button onClick={() => {
                                        if (window.confirm('Delete event?')) {
                                            deleteTimelineEvent(event.id);
                                            addToast('Event deleted', 'info');
                                        }
                                    }}><Trash2 size={16} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'home' && (
                <div className="home-management">
                    <div className="admin-card">
                        <h3>Hero Section Settings</h3>
                        <div className="form-group">
                            <label>Main Title</label>
                            <input
                                type="text"
                                value={heroForm.title}
                                onChange={e => setHeroForm({ ...heroForm, title: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Subtitle (Supports multiline)</label>
                            <textarea
                                rows="3"
                                value={heroForm.subtitle}
                                onChange={e => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Background Image URL</label>
                            <input
                                type="text"
                                value={heroForm.image}
                                onChange={e => setHeroForm({ ...heroForm, image: e.target.value })}
                            />
                            {heroForm.image && <img src={heroForm.image} alt="Preview" className="preview-sm" />}
                        </div>
                        <button className="save-btn" onClick={() => {
                            updateHero(heroForm);
                            addToast('Home settings saved', 'success');
                        }}>
                            <Save size={16} /> Save Changes
                        </button>
                    </div>
                </div>
            )}
        </div>

            export default AdminPanel;
