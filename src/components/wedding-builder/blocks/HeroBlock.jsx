"use client";

import { Calendar, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { getFontClass, getFontByValue } from "@/lib/wedding-fonts";

// Hero block component with style variants
export default function HeroBlock({ data, theme, animated = false }) {
  const { 
    title, 
    subtitle, 
    date, 
    location, 
    backgroundImage, 
    backgroundColor,
    overlay = true,
    overlayOpacity = 0.4,
    titleFont, 
    subtitleFont,
    titleColor,
    subtitleColor,
    styleVariant = 'fullscreen' // fullscreen, centered, split, minimal
  } = data;
  
  const animationProps = animated ? {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true },
    transition: { duration: 1, ease: "easeOut" }
  } : {};

  const BlockWrapper = animated ? motion.div : 'div';
  
  // Render based on style variant
  switch (styleVariant) {
    case 'centered':
      return renderCenteredStyle();
    case 'split':
      return renderSplitStyle();
    case 'minimal':
      return renderMinimalStyle();
    case 'fullscreen':
    default:
      return renderFullscreenStyle();
  }

  // Fullscreen hero style (original)
  function renderFullscreenStyle() {
    return (
      <BlockWrapper {...animationProps} 
        className={`relative h-screen flex items-center justify-center ${!backgroundImage ? `bg-gradient-to-br ${theme.gradients.hero}` : ''}`}
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
          backgroundColor: backgroundColor && !backgroundImage ? backgroundColor : 'transparent',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {overlay && backgroundImage && (
          <div className="absolute inset-0 bg-black" style={{ opacity: overlayOpacity }}></div>
        )}
        
        <div className="relative z-10 text-center px-4">
          {subtitle && (
            <p 
              className={`text-xl mb-4 opacity-90 ${subtitleFont ? getFontClass(subtitleFont) : theme.fonts.body}`}
              style={{ 
                fontFamily: subtitleFont ? getFontByValue(subtitleFont).label : undefined,
                color: subtitleColor || '#ffffff'
              }}
            >
              {subtitle}
            </p>
          )}
          
          <h1 
            className={`text-6xl md:text-8xl mb-8 ${titleFont ? getFontClass(titleFont) : theme.fonts.heading}`}
            style={{ 
              fontFamily: titleFont ? getFontByValue(titleFont).label : undefined,
              color: titleColor || '#ffffff'
            }}
          >
            {title}
          </h1>
          
          {date && (
            <div className="flex items-center justify-center gap-2 text-xl mb-4" style={{ color: '#ffffff' }}>
              <Calendar className="w-5 h-5" />
              <span>{date}</span>
            </div>
          )}
          
          {location && (
            <div className="flex items-center justify-center gap-2 text-xl" style={{ color: '#ffffff' }}>
              <MapPin className="w-5 h-5" />
              <span>{location}</span>
            </div>
          )}
          
          <div className="mt-8">
            <div className="text-4xl animate-pulse">💕</div>
          </div>
        </div>
        
        {/* <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white rounded-full"></div>
          </div>
        </div> */}
      </BlockWrapper>
    );
  }

  // Centered hero style with smaller height
  function renderCenteredStyle() {
    return (
      <BlockWrapper {...animationProps} 
        className={`relative py-32 flex items-center justify-center ${!backgroundImage ? `bg-gradient-to-br ${theme.gradients.hero}` : ''}`}
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
          backgroundColor: backgroundColor && !backgroundImage ? backgroundColor : 'transparent',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {overlay && backgroundImage && (
          <div className="absolute inset-0 bg-black" style={{ opacity: overlayOpacity }}></div>
        )}
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {subtitle && (
            <p 
              className={`text-lg mb-3 opacity-90 ${subtitleFont ? getFontClass(subtitleFont) : theme.fonts.body}`}
              style={{ 
                fontFamily: subtitleFont ? getFontByValue(subtitleFont).label : undefined,
                color: subtitleColor || '#ffffff'
              }}
            >
              {subtitle}
            </p>
          )}
          
          <h1 
            className={`text-5xl md:text-7xl mb-6 ${titleFont ? getFontClass(titleFont) : theme.fonts.heading}`}
            style={{ 
              fontFamily: titleFont ? getFontByValue(titleFont).label : undefined,
              color: titleColor || '#ffffff'
            }}
          >
            {title}
          </h1>
          
          <div className="flex items-center justify-center gap-6 text-base flex-wrap" style={{ color: '#ffffff' }}>
            {date && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{date}</span>
              </div>
            )}
            {location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{location}</span>
              </div>
            )}
          </div>
          
          <div className="mt-6">
            <div className="text-3xl">💕</div>
          </div>
        </div>
      </BlockWrapper>
    );
  }

  // Split style with image on one side
  function renderSplitStyle() {
    return (
      <BlockWrapper {...animationProps} 
        className="relative"
        style={{ backgroundColor: backgroundColor || 'white' }}
      >
        <div className="grid md:grid-cols-2 min-h-[600px]">
          {/* Image side */}
          <div 
            className="relative h-64 md:h-auto"
            style={{
              backgroundImage: backgroundImage ? `url(${backgroundImage})` : `linear-gradient(to br, ${theme.colors.primary}, ${theme.colors.secondary})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {overlay && backgroundImage && (
              <div className="absolute inset-0 bg-black" style={{ opacity: overlayOpacity * 0.5 }}></div>
            )}
          </div>
          
          {/* Content side */}
          <div className="flex items-center justify-center p-8 md:p-16">
            <div className="text-center md:text-left max-w-lg">
              {subtitle && (
                <p 
                  className={`text-lg mb-3 ${subtitleFont ? getFontClass(subtitleFont) : theme.fonts.body}`}
                  style={{ 
                    fontFamily: subtitleFont ? getFontByValue(subtitleFont).label : undefined,
                    color: subtitleColor || '#6b7280'
                  }}
                >
                  {subtitle}
                </p>
              )}
              
              <h1 
                className={`text-5xl md:text-6xl mb-6 ${titleFont ? getFontClass(titleFont) : theme.fonts.heading}`}
                style={{ 
                  fontFamily: titleFont ? getFontByValue(titleFont).label : undefined,
                  color: titleColor || '#1f2937'
                }}
              >
                {title}
              </h1>
              
              <div className="space-y-2" style={{ color: '#6b7280' }}>
                {date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" style={{ color: theme.colors.accent }} />
                    <span>{date}</span>
                  </div>
                )}
                {location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" style={{ color: theme.colors.accent }} />
                    <span>{location}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <div className="text-4xl">💕</div>
              </div>
            </div>
          </div>
        </div>
      </BlockWrapper>
    );
  }

  // Minimal style
  function renderMinimalStyle() {
    return (
      <BlockWrapper {...animationProps} 
        className="py-24"
        style={{ backgroundColor: backgroundColor || 'white' }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            {subtitle && (
              <p 
                className={`text-base mb-2 uppercase tracking-wider ${subtitleFont ? getFontClass(subtitleFont) : theme.fonts.body}`}
                style={{ 
                  fontFamily: subtitleFont ? getFontByValue(subtitleFont).label : undefined,
                  color: subtitleColor || '#6b7280'
                }}
              >
                {subtitle}
              </p>
            )}
            
            <h1 
              className={`text-6xl md:text-7xl mb-8 ${titleFont ? getFontClass(titleFont) : theme.fonts.heading}`}
              style={{ 
                fontFamily: titleFont ? getFontByValue(titleFont).label : undefined,
                color: titleColor || '#1f2937'
              }}
            >
              {title}
            </h1>
            
            <div className="flex items-center justify-center gap-8 text-base" style={{ color: '#6b7280' }}>
              {date && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{date}</span>
                </div>
              )}
              {location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{location}</span>
                </div>
              )}
            </div>
            
            {backgroundImage && (
              <div className="mt-12">
                <img 
                  src={backgroundImage} 
                  alt={title}
                  className="w-full max-w-2xl mx-auto rounded-lg shadow-2xl"
                />
              </div>
            )}
          </div>
        </div>
      </BlockWrapper>
    );
  }
}

// Default data for new hero blocks
export const heroBlockDefaults = {
  title: "Anna & Mikael",
  subtitle: "Suomenlinna, Helsinki",
  date: "15.07.2024",
  location: "Suomenlinna, Helsinki",
  backgroundImage: null,
  titleColor: '#ffffff',
  subtitleColor: '#ffffff',
  styleVariant: 'fullscreen'
};
