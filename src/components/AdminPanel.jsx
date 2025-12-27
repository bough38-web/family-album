import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Trash2, Save, Image as ImageIcon } from 'lucide-react';
import { usePhotos } from '../context/PhotoContext';
import './AdminPanel.css';

const AdminPanel = () => {
    const [uploads, setUploads] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const { photos, addPhoto, removePhoto } = usePhotos();

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
            file,
            url: URL.createObjectURL(file), // Preview URL
            name: file.name
        }));
        setUploads([...uploads, ...newUploads]);
    };

    const handleSave = () => {
        // Process each upload
        uploads.forEach(upload => {
            // Create Base64 string for storage
            const reader = new FileReader();
            reader.onloadend = () => {
                addPhoto({
                    title: upload.name.split('.')[0] || 'New Memory',
                    url: reader.result,
                    size: 'medium' // Default size
                });
            };
            reader.readAsDataURL(upload.file);
        });

        setUploads([]); // Clear uploads
        alert("Photos saved locally!");
    };

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1>Photo Management</h1>
                <p>Upload new memories to the family album.</p>
            </div>

            <div className="admin-content">
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
                    />
                    <label htmlFor="file-input" className="upload-label">
                        <Upload size={48} className="upload-icon" />
                        <h3>Drag & Drop photos here</h3>
                        <p>or click to browse</p>
                    </label>
                </div>

                {uploads.length > 0 && (
                    <div className="uploads-preview">
                        <h3>Ready to Upload ({uploads.length})</h3>
                        <div className="preview-grid">
                            {uploads.map((upload, index) => (
                                <motion.div
                                    key={index}
                                    className="preview-item"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                >
                                    <img src={upload.url} alt="preview" />
                                    <button onClick={() => setUploads(uploads.filter((_, i) => i !== index))}>
                                        <Trash2 size={16} />
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                        <button className="save-btn" onClick={handleSave}>
                            <Save size={20} />
                            Save Changes
                        </button>
                    </div>
                )}

                <div className="existing-photos">
                    <h3>Current Gallery Photos ({photos.length})</h3>
                    <div className="preview-grid">
                        {photos.map((photo) => (
                            <div key={photo.id} className="existing-item">
                                <img src={photo.url} alt={photo.title} />
                                <div className="item-info">
                                    <span>{photo.title}</span>
                                </div>
                                <button
                                    onClick={() => removePhoto(photo.id)}
                                    style={{
                                        position: 'absolute',
                                        top: 5,
                                        right: 5,
                                        background: 'rgba(0,0,0,0.6)',
                                        border: 'none',
                                        color: 'white',
                                        borderRadius: '50%',
                                        width: 24,
                                        height: 24,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: 0
                                    }}
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
