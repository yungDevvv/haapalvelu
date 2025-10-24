"use client";

import { motion } from "framer-motion";

// Divider block component for visual separation
export default function DividerBlock({ data, theme, animated = false }) {
  const { 
    dividerStyle = '1',
    color,
    width = 80,
    paddingY = 40,
    backgroundColor
  } = data;

  const animationProps = animated ? {
    initial: { opacity: 0, scale: 0.8 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6, ease: "easeOut" }
  } : {};

  const BlockWrapper = animated ? motion.div : 'div';

  return (
    <BlockWrapper 
      {...animationProps}
      style={{
        backgroundColor: backgroundColor || 'transparent',
        paddingTop: `${paddingY}px`,
        paddingBottom: `${paddingY}px`,
      }}
      className="flex items-center justify-center"
    >
      <div 
        style={{ 
          width: `${width}%`,
          maxWidth: '600px'
        }}
      >
        <img
          src={`/editor/dividers/${dividerStyle}.svg`}
          alt="Divider"
          className="w-full h-auto"
          style={{
            filter: color ? getSVGColorFilter(color) : 'none',
          }}
        />
      </div>
    </BlockWrapper>
  );
}

// Helper function to convert hex color to SVG filter
function getSVGColorFilter(hexColor) {
  // Convert hex to RGB and create filter
  // Using invert, sepia, saturate, and hue-rotate to colorize SVG
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Simple colorize approach: brightness(0) to make black, then use sepia and hue-rotate
  // For better accuracy, we use a combination of filters
  return `brightness(0) saturate(100%) invert(${(r + g + b) / 765}) sepia(100%) saturate(200%) hue-rotate(${getHueRotation(hexColor)}deg) brightness(0.9)`;
}

// Calculate hue rotation for color transformation
function getHueRotation(hexColor) {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  
  if (max !== min) {
    const d = max - min;
    if (max === r) {
      h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    } else if (max === g) {
      h = ((b - r) / d + 2) / 6;
    } else {
      h = ((r - g) / d + 4) / 6;
    }
  }
  
  return Math.round(h * 360);
}

// Default data for new divider blocks
export const dividerBlockDefaults = {
  dividerStyle: '1',
  width: 80,
  paddingY: 40,
  color: null,
  backgroundColor: null
};
