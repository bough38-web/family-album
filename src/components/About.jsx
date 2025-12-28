import React from 'react';

import { motion } from 'framer-motion';
import { Heart, Star, Sun } from 'lucide-react';
import './About.css';

const About = () => {
    return (
        <div className="about-page">
            <section className="about-hero">
                <motion.div
                    className="about-hero-content"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1>Our Story</h1>
                    <p>Building a legacy of love, one day at a time.</p>
                </motion.div>
            </section>

            <section className="about-content">
                <motion.div
                    className="about-text"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2>Who We Are</h2>
                    <p>
                        We are a family that believes in the power of small moments.
                        This website is our digital home, a place where we keep our most
                        cherished memories safe and share our daily joys.
                    </p>
                    <p>
                        From Sunday morning pancakes to yearly summer vacations,
                        every picture tells a story of growth, love, and togetherness.
                    </p>
                </motion.div>

                <motion.div
                    className="about-image"
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <img
                        src="https://images.unsplash.com/photo-1596956627038-1422d3b2361b?q=80&w=1000&auto=format&fit=crop"
                        alt="Family holding hands"
                    />
                </motion.div>
            </section>

            <section className="values-section">
                <h2>Our Values</h2>
                <div className="values-grid">
                    <div className="value-item">
                        <Heart size={40} className="value-icon" />
                        <h3>Love</h3>
                        <p>The foundation of everything we do.</p>
                    </div>
                    <div className="value-item">
                        <Sun size={40} className="value-icon" />
                        <h3>Joy</h3>
                        <p>Finding happiness in the simple things.</p>
                    </div>
                    <div className="value-item">
                        <Star size={40} className="value-icon" />
                        <h3>Growth</h3>
                        <p>Supporting each other's dreams.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
