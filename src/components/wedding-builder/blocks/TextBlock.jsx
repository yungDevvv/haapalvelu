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
    paddingY = 20,
    paddingX = 16
  } = data;

  const animationProps = animated ? {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6, ease: "easeOut" }
  } : {};

  // If there's a background image, use two-column layout
  if (backgroundImage) {
    const ContentWrapper = animated ? motion.div : 'div';
    return (
      <div 
        style={{
          backgroundColor: backgroundColor || 'white',
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
        </ContentWrapper>
      </div>
    );
  }

  // Default single column layout
  const alignmentClass = alignment === 'center' ? 'text-center' : alignment === 'right' ? 'text-right' : 'text-left';
  const ContentWrapper = animated ? motion.div : 'div';
  
  return (
    <div 
      style={{
        backgroundColor: backgroundColor || 'white',
        paddingTop: `${paddingY}px`,
        paddingBottom: `${paddingY}px`,
        paddingLeft: `${paddingX}px`,
        paddingRight: `${paddingX}px`
      }}
    >
      <ContentWrapper 
        {...animationProps}
        className={`prose max-w-none ${alignmentClass} ${contentFont ? getFontClass(contentFont) : theme.fonts.body}`}
        style={{ 
          color: contentColor || '#374151',
          fontFamily: contentFont ? getFontByValue(contentFont).label : undefined,
          lineHeight: '1.8',
          fontSize: '16px'
        }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}

// Default data for new text blocks
export const textBlockDefaults = {
  content: "Kirjoita tähän tarinanne...",
  alignment: "center"
};
