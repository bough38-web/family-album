import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';
import './Timeline.css';

const events = [
    { id: 1, date: '2025-12-25', title: 'Christmas Dinner', desc: 'A wonderful evening with everyone gathered around the table.', img: 'https://images.unsplash.com/photo-1576824228987-a3d8df8d4360?q=80&w=800&auto=format&fit=crop' },
    { id: 2, date: '2025-11-15', title: 'Autumn Hike', desc: 'The mountains were golden. Dad made it to the peak!', img: 'https://images.unsplash.com/photo-1445778235210-9b4344d5a92a?q=80&w=800&auto=format&fit=crop' },
    { id: 3, date: '2025-09-02', title: 'Back to School', desc: 'First day for the little ones. They were so excited.', img: 'https://images.unsplash.com/photo-1427504746696-ea5abd7dfe33?q=80&w=800&auto=format&fit=crop' },
    { id: 4, date: '2025-07-20', title: 'Summer Vacation', desc: 'Jeju Island trip. The sunset was unforgettable.', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop' },
];

const Timeline = () => {
    return (
        <div className="timeline-page">
            <div className="timeline-header">
                <h2>Family Journal</h2>
                <p>Recording our precious days.</p>
            </div>

            <div className="timeline-container">
                {events.map((event, index) => (
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
                                <Calendar size={14} />
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
