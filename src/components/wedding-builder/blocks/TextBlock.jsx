"use client";

import { motion } from "framer-motion";
import { getFontClass, getFontByValue } from "@/lib/wedding-fonts";

// Simple text/story block with rich text support (without title - use HeadingBlock instead)
export default function TextBlock({ data, theme, animated = false }) {
  const { 
    content, 
    alignment, 
    contentFont,
    contentColor,
    backgroundColor,
    backgroundImage,
    imagePosition = 'left',
    paddingY = 80,
    paddingX = 16
  } = data;

  const animationProps = animated ? {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6, ease: "easeOut" }
  } : {};

  const BlockWrapper = animated ? motion.div : 'div';

  // If there's a background image, use two-column layout
  if (backgroundImage) {
    return (
      <BlockWrapper 
        {...animationProps} 
        style={{
          backgroundColor: backgroundColor || 'white',
          paddingTop: `${paddingY}px`,
          paddingBottom: `${paddingY}px`,
          paddingLeft: `${paddingX}px`,
          paddingRight: `${paddingX}px`
        }}
      >
        <div className="container mx-auto px-4">
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${imagePosition === 'right' ? 'lg:flex-row-reverse' : ''}`}>
            {/* Image Column */}
            <div className={`${imagePosition === 'right' ? 'lg:order-2' : 'lg:order-1'}`}>
              <div 
                className="rounded-2xl overflow-hidden shadow-2xl h-[400px] lg:h-[600px]"
                style={{
                  backgroundImage: `url(${backgroundImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
            </div>
            
            {/* Text Column */}
            <div className={`${imagePosition === 'right' ? 'lg:order-1' : 'lg:order-2'}`}>
              <div 
                className={`prose max-w-none ${contentFont ? getFontClass(contentFont) : theme.fonts.body}`}
                style={{ 
                  color: contentColor || '#374151',
                  fontFamily: contentFont ? getFontByValue(contentFont).label : undefined,
                  lineHeight: '1.8',
                  fontSize: '16px'
                }}
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          </div>
        </div>
      </BlockWrapper>
    );
  }

  // Default single column layout
  return (
    <BlockWrapper 
      {...animationProps} 
      style={{
        backgroundColor: backgroundColor || 'white',
        paddingTop: `${paddingY}px`,
        paddingBottom: `${paddingY}px`,
        paddingLeft: `${paddingX}px`,
        paddingRight: `${paddingX}px`
      }}
    >
      <div className="container mx-auto px-4">
        <div className={`max-w-3xl mx-auto ${alignment === 'center' ? 'text-center' : ''}`}>
          <div 
            className={`prose max-w-none ${contentFont ? getFontClass(contentFont) : theme.fonts.body}`}
            style={{ 
              color: contentColor || '#374151',
              fontFamily: contentFont ? getFontByValue(contentFont).label : undefined,
              lineHeight: '1.8',
              fontSize: '16px'
            }}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </BlockWrapper>
  );
}

// Default data for new text blocks
export const textBlockDefaults = {
  content: "Kirjoita tähän tarinanne...",
  alignment: "left"
};
