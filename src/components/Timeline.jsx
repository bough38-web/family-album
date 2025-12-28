import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import './Timeline.css';

const Timeline = () => {
    const { timelineEvents } = useContent();

    return (
        <div className="timeline-page">
            <div className="timeline-header">
                <h2>Family Journal</h2>
                <p>Recording our precious days.</p>
            </div>

            <div className="timeline-container">
                {timelineEvents.map((event, index) => (
                    <motion.div
                        key={event.id}
                        className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="timeline-content">
                            <div className="timeline-date">
                                <Calendar size={14} aria-hidden="true" />
                                <span>{event.date}</span>
                            </div>
                            <h3>{event.title}</h3>
                            <p>{event.desc}</p>
                            {event.img && (
                                <div className="timeline-img-wrapper">
                                    <img src={event.img} alt={event.title} loading="lazy" />
                                </div>
                            )}
                        </div>
                        <div className="timeline-dot"></div>
                    </motion.div>
                ))}
                {/* Vertical Line is handled in CSS */}
            </div>
        </div>
    );
};

export default Timeline;
