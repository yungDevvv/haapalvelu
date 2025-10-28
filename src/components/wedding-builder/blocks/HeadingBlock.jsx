"use client";

import { motion } from "framer-motion";
import { getFontClass, getFontByValue } from "@/lib/wedding-fonts";

// Heading block component for titles and headings
export default function HeadingBlock({ data, theme, animated = false }) {
  const { 
    text,
    level = 'h2', // h1, h2, h3, h4
    alignment = 'center',
    font,
    color,
    backgroundColor,
    paddingY = 20,
    paddingX = 16
  } = data;

  const animationProps = animated ? {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6, ease: "easeOut" }
  } : {};

  const ContentWrapper = animated ? motion.div : 'div';
  
  // Size mapping for heading levels
  const sizeClasses = {
    h1: 'text-5xl md:text-7xl',
    h2: 'text-4xl md:text-5xl',
    h3: 'text-3xl md:text-4xl',
    h4: 'text-2xl md:text-3xl'
  };

  const HeadingTag = level;

  return (
    <div 
      style={{
        backgroundColor: backgroundColor || 'transparent',
        paddingTop: `${paddingY}px`,
        paddingBottom: `${paddingY}px`,
        paddingLeft: `${paddingX}px`,
        paddingRight: `${paddingX}px`
      }}
    >
      <ContentWrapper 
        {...animationProps}
        className="container mx-auto px-4"
      >
        <div className={`max-w-4xl mx-auto text-${alignment}`}>
          <HeadingTag 
            className={`${sizeClasses[level]} ${font ? getFontClass(font) : theme.fonts.heading}`} 
            style={{ 
              color: color || theme.colors.primary,
              fontFamily: font ? getFontByValue(font).label : undefined 
            }}
          >
            {text}
          </HeadingTag>
        </div>
      </ContentWrapper>
    </div>
  );
}

// Default data for new heading blocks
export const headingBlockDefaults = {
  text: "Otsikko",
  level: 'h2',
  alignment: 'center',
  font: 'playfair',
  color: '#6b5b7b',
  backgroundColor: '#e8dff5'
};
