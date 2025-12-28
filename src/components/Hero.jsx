import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import './Hero.css';

const Hero = () => {
    const { heroContent } = useContent();

    return (
        <section className="hero-section">
            <div className="hero-bg">
                <motion.img
                    src={heroContent.image}
                    alt="Hero Background"
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 10, ease: "easeOut" }}
                />
                <div className="hero-overlay"></div>
            </div>

            <div className="hero-content">
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                >
                    {heroContent.title}
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    style={{ whiteSpace: 'pre-line' }}
                >
                    {heroContent.subtitle}
                </motion.p>
            </div>

            <motion.div
                className="scroll-indicator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
            >
                <span>Discover Our Story</span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                    <ChevronDown size={24} aria-hidden="true" />
                </motion.div>
            </motion.div>
        </section>
    );
};

export default Hero;
