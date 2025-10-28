"use client";

import { motion } from "framer-motion";

// Navigation block with multiple style variants
export default function NavigationBlock({ data, theme, animated = false }) {
  const { 
    items = [
      { label: 'Hääinfo', id: 'haainfo' },
      { label: 'Ilmoittautuminen', id: 'ilmoittautuminen' },
      { label: 'Yhteystiedot', id: 'yhteystiedot' }
    ],
    styleVariant = 'ribbon', // ribbon, minimal, dots, underline, badges
    backgroundColor,
    textColor,
    accentColor,
    paddingY = 20,
    paddingX = 16
  } = data;

  const animationProps = animated ? {
    initial: { opacity: 0, y: -20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6, ease: "easeOut" }
  } : {};

  const ContentWrapper = animated ? motion.div : 'div';

  // Ribbon style - with decorative ribbon background
  const renderRibbonStyle = () => (
    <div className="relative flex items-center justify-center">
      <div 
        className="absolute inset-0 flex items-center"
        style={{ backgroundColor: accentColor || theme.colors.primary, opacity: 0.1 }}
      >
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 100">
          <polygon points="0,50 50,0 950,0 1000,50 950,100 50,100" fill={accentColor || theme.colors.primary} opacity="0.15" />
        </svg>
      </div>
      <div className="relative flex gap-8 md:gap-12 justify-center flex-wrap px-8 py-6">
        {items.map((item, idx) => (
          <button
            key={idx}
            className="text-sm md:text-base font-semibold uppercase tracking-wide transition-all hover:opacity-70"
            style={{ color: textColor || theme.colors.primary }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );

  // Minimal style - simple text links
  const renderMinimalStyle = () => (
    <div className="flex gap-6 md:gap-10 justify-center flex-wrap px-4 py-4">
      {items.map((item, idx) => (
        <button
          key={idx}
          className="text-sm md:text-base font-medium transition-all hover:opacity-60"
          style={{ color: textColor || theme.colors.primary }}
        >
          {item.label}
        </button>
      ))}
    </div>
  );

  // Dots style - with decorative dots
  const renderDotsStyle = () => (
    <div className="flex gap-4 md:gap-8 justify-center flex-wrap items-center px-4 py-6">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-3">
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: accentColor || theme.colors.primary }}
          />
          <button
            className="text-sm md:text-base font-medium transition-all hover:opacity-60"
            style={{ color: textColor || theme.colors.primary }}
          >
            {item.label}
          </button>
        </div>
      ))}
    </div>
  );

  // Underline style - with bottom border
  const renderUnderlineStyle = () => (
    <div className="flex gap-6 md:gap-12 justify-center flex-wrap px-4 py-6 border-b-2" style={{ borderColor: accentColor || theme.colors.primary }}>
      {items.map((item, idx) => (
        <button
          key={idx}
          className="text-sm md:text-base font-semibold uppercase tracking-wide pb-2 transition-all hover:opacity-60 relative group"
          style={{ color: textColor || theme.colors.primary }}
        >
          {item.label}
          <div 
            className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all"
            style={{ backgroundColor: accentColor || theme.colors.primary }}
          />
        </button>
      ))}
    </div>
  );

  // Badges style - with background badges
  const renderBadgesStyle = () => (
    <div className="flex gap-3 md:gap-4 justify-center flex-wrap px-4 py-6">
      {items.map((item, idx) => (
        <button
          key={idx}
          className="px-4 md:px-6 py-2 md:py-3 rounded-full text-sm md:text-base font-semibold transition-all hover:shadow-lg hover:scale-105"
          style={{ 
            backgroundColor: accentColor || theme.colors.primary,
            color: 'white'
          }}
        >
          {item.label}
        </button>
      ))}
    </div>
  );

  // Render based on style variant
  const renderContent = () => {
    switch (styleVariant) {
      case 'minimal':
        return renderMinimalStyle();
      case 'dots':
        return renderDotsStyle();
      case 'underline':
        return renderUnderlineStyle();
      case 'badges':
        return renderBadgesStyle();
      case 'ribbon':
      default:
        return renderRibbonStyle();
    }
  };

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
        {renderContent()}
      </ContentWrapper>
    </div>
  );
}

// Default data for new navigation blocks
export const navigationBlockDefaults = {
  items: [
    { label: 'Hääinfo', id: 'haainfo' },
    { label: 'Ilmoittautuminen', id: 'ilmoittautuminen' },
    { label: 'Yhteystiedot', id: 'yhteystiedot' }
  ],
  styleVariant: 'ribbon',
  paddingY: 20,
  paddingX: 16
};
