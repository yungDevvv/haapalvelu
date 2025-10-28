"use client";

import { motion } from "framer-motion";

// Spacer block for adding empty space between sections
export default function SpacerBlock({ data, theme, animated = false }) {
  const { 
    height = 40,
    backgroundColor
  } = data;

  const animationProps = animated ? {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.3, ease: "easeOut" }
  } : {};

  const BlockWrapper = animated ? motion.div : 'div';

  return (
    <BlockWrapper 
      {...animationProps}
      style={{
        height: `${height}px`,
        backgroundColor: backgroundColor || 'transparent',
        width: '100%'
      }}
    />
  );
}

// Default data for new spacer blocks
export const spacerBlockDefaults = {
  height: 40
};
