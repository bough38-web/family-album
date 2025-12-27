import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import './Hero.css';

const Hero = () => {
    return (
        <section className="hero-section">
            <div className="hero-bg">
                {/* Placeholder image from Unsplash - warm family/nature vibe */}
                <motion.img
                    src="https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=2070&auto=format&fit=crop"
                    alt="Family Moments"
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
                    Cherished Moments
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    style={{ whiteSpace: 'pre-line' }}
                >
                    평범한 하루가 가장 아름다운 이야기입니다.<br />
                    우리의 소중한 추억을 영원히 간직하세요.
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
                    <ChevronDown size={24} />
                </motion.div>
            </motion.div>
        </section>
    );
};

export default Hero;
