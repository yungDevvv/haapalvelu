"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Countdown timer block
export default function CountdownBlock({ data, theme, animated = false }) {
  const { 
    title, 
    description,
    targetDate, 
    backgroundColor, 
    titleColor, 
    descriptionColor 
  } = data;
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate) - new Date();
      
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        };
      }
      
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const animationProps = animated ? {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6, ease: "easeOut" }
  } : {};

  const BlockWrapper = animated ? motion.div : 'div';

  return (
    <BlockWrapper 
      {...animationProps} 
      className={`py-20 ${!backgroundColor ? `bg-gradient-to-br ${theme.gradients.section}` : ''}`}
      style={{ backgroundColor: backgroundColor || 'transparent' }}
    >
      <div className="container mx-auto px-4 text-center">
        <h2 
          className={`text-4xl md:text-5xl mb-4 ${theme.fonts.heading}`} 
          style={{ color: titleColor || theme.colors.primary }}
        >
          {title}
        </h2>
        
        {description && (
          <p 
            className="text-lg mb-12 opacity-80"
            style={{ color: descriptionColor || theme.colors.text }}
          >
            {description}
          </p>
        )}
        
        <div className="flex justify-center gap-4 md:gap-8 flex-wrap">
          {/* Days */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 min-w-[100px]">
            <div className="text-5xl md:text-6xl font-bold" style={{ color: titleColor || theme.colors.primary }}>
              {timeLeft.days}
            </div>
            <div className="text-sm md:text-base text-gray-600 mt-2">Päivää</div>
          </div>
          
          {/* Hours */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 min-w-[100px]">
            <div className="text-5xl md:text-6xl font-bold" style={{ color: titleColor || theme.colors.primary }}>
              {timeLeft.hours}
            </div>
            <div className="text-sm md:text-base text-gray-600 mt-2">Tuntia</div>
          </div>
          
          {/* Minutes */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 min-w-[100px]">
            <div className="text-5xl md:text-6xl font-bold" style={{ color: titleColor || theme.colors.primary }}>
              {timeLeft.minutes}
            </div>
            <div className="text-sm md:text-base text-gray-600 mt-2">Minuuttia</div>
          </div>
          
          {/* Seconds */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 min-w-[100px]">
            <div className="text-5xl md:text-6xl font-bold" style={{ color: titleColor || theme.colors.primary }}>
              {timeLeft.seconds}
            </div>
            <div className="text-sm md:text-base text-gray-600 mt-2">Sekuntia</div>
          </div>
        </div>
      </div>
    </BlockWrapper>
  );
}

// Default data for new countdown blocks
export const countdownBlockDefaults = {
  title: "Aikaa Häihin",
  targetDate: "2024-07-15T15:00:00"
};
