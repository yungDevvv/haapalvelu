"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Countdown timer block
export default function CountdownBlock({ data, theme, animated = false }) {
  const { 
    targetDate, 
    backgroundColor, 
    titleColor,
    styleVariant,
    paddingY = 20,
    paddingX = 16
  } = data;
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Determine effective target once per targetDate change
    const now = new Date();
    let effectiveTarget = new Date(targetDate);
    // Helsinki default: 21.11.2025 10:00 (UTC+02:00 at that date)
    const helsinkiDefault = new Date('2025-11-21T10:00:00+02:00');
    if (isNaN(effectiveTarget.getTime()) || effectiveTarget <= now) {
      effectiveTarget = helsinkiDefault > now ? helsinkiDefault : new Date(now.getTime() + 1000 * 60 * 60 * 24 * 180);
    }

    const calculateTimeLeft = () => {
      const current = new Date();
      const difference = effectiveTarget.getTime() - current.getTime();
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const animationProps = animated ? {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6, ease: "easeOut" }
  } : {};

  const labels = {
    days: 'Päivää',
    hours: 'Tuntia',
    minutes: 'Minuuttia',
    seconds: 'Sekuntia',
  };

  const colorPrimary = titleColor || theme.colors.primary;

  const CardsLayout = () => (
    <div className="flex justify-center gap-4 md:gap-8 flex-wrap">
      {[{k:'days', v:timeLeft.days},{k:'hours', v:timeLeft.hours},{k:'minutes', v:timeLeft.minutes},{k:'seconds', v:timeLeft.seconds}].map(({k, v}) => (
        <div key={k} className="bg-white rounded-2xl shadow-lg p-6 md:p-8 min-w-[110px]">
          <div className="text-5xl md:text-6xl font-bold" style={{ color: colorPrimary }}>{v}</div>
          <div className="text-sm md:text-base text-gray-600 mt-2">{labels[k]}</div>
        </div>
      ))}
    </div>
  );

  const MinimalLayout = () => (
    <div className="flex items-end justify-center gap-6 md:gap-10 flex-wrap">
      {[{k:'days', v:timeLeft.days},{k:'hours', v:timeLeft.hours},{k:'minutes', v:timeLeft.minutes},{k:'seconds', v:timeLeft.seconds}].map(({k, v}, idx) => (
        <div key={k} className="text-center">
          <div className="text-6xl md:text-7xl font-bold tracking-tight" style={{ color: colorPrimary }}>{v}</div>
          <div className="text-xs md:text-sm uppercase tracking-widest opacity-70" style={{ color: descriptionColor || theme.colors.text }}>{labels[k]}</div>
        </div>
      ))}
    </div>
  );

  const FramedLayout = () => (
    <div className="mx-auto max-w-4xl bg-white/90 border border-pink-200 rounded-3xl shadow-md px-6 md:px-10 py-8">
      <CardsLayout />
    </div>
  );

  const GradientLayout = () => (
    <div className="rounded-3xl px-6 md:px-10 py-8 bg-gradient-to-br from-rose-50 to-purple-50">
      <MinimalLayout />
    </div>
  );

  const sectionBG = !backgroundColor && (styleVariant === 'gradient')
    ? ''
    : (!backgroundColor ? `bg-gradient-to-br ${theme.gradients.section}` : '');

  const renderByVariant = () => {
    switch (styleVariant) {
      case 'minimal':
        return <MinimalLayout />;
      case 'framed':
        return <FramedLayout />;
      case 'gradient':
        return <GradientLayout />;
      case 'cards':
      default:
        return <CardsLayout />;
    }
  };

  const ContentWrapper = animated ? motion.div : 'div';

  return (
    <div
      className={`${sectionBG}`}
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
        className="container mx-auto px-4 text-center"
      >
        {renderByVariant()}
      </ContentWrapper>
    </div>
  );
}

// Default data for new countdown blocks
export const countdownBlockDefaults = {
  // Default to realistic Finland time (Europe/Helsinki): 21.11.2025 10:00
  targetDate: "2025-11-21T10:00:00+02:00",
  styleVariant: 'cards',
  paddingY: 20,
  paddingX: 16
};
