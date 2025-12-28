import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import './Toast.css';

const icons = {
    success: <CheckCircle size={20} />,
    error: <AlertCircle size={20} />,
    info: <Info size={20} />
};

const Toast = ({ id, message, type = 'info', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(id);
        }, 3000);

        return () => clearTimeout(timer);
    }, [id, onClose]);

    return (
        <motion.div
            className={`toast toast-${type}`}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            layout
        >
            <div className="toast-icon">{icons[type]}</div>
            <div className="toast-message">{message}</div>
            <button className="toast-close" onClick={() => onClose(id)}>
                <X size={16} />
            </button>
        </motion.div>
    );
};

export const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div className="toast-container">
            <AnimatePresence>
                {toasts.map(toast => (
                    <Toast key={toast.id} {...toast} onClose={removeToast} />
                ))}
            </AnimatePresence>
        </div>
    );
};
