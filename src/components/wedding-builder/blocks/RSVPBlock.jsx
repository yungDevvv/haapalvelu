"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

// RSVP form block
export default function RSVPBlock({ data, theme, animated = false }) {
  const { 
    title, 
    description, 
    backgroundColor, 
    titleColor, 
    descriptionColor,
    buttonColor 
  } = data;
  const [selected, setSelected] = useState(null);

  const handleChoice = (choice) => {
    setSelected(choice);
    // Here you would integrate with your RSVP system
  };

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
      className="py-20"
      style={{ backgroundColor: backgroundColor || `bg-gradient-to-br ${theme.gradients.section}` }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 
            className={`text-4xl md:text-5xl mb-4 ${theme.fonts.heading}`} 
            style={{ color: titleColor || theme.colors.primary }}
          >
            {title}
          </h2>
          
          {description && (
            <p 
              className="text-lg mb-8"
              style={{ color: descriptionColor || '#6b7280' }}
            >
              {description}
            </p>
          )}

          {!selected ? (
            <div className="grid md:grid-cols-2 gap-4 mt-8">
              {/* Accept button */}
              <Card 
                className="cursor-pointer hover:shadow-xl transition-all hover:scale-105"
                onClick={() => handleChoice('accepted')}
              >
                <CardContent className="p-8 text-center">
                  <div className="text-5xl mb-4">✨</div>
                  <h3 className="text-xl font-semibold mb-2">Tulen häihin</h3>
                  <p className="text-sm text-gray-600">Vahvista osallistumisesi</p>
                </CardContent>
              </Card>

              {/* Decline button */}
              <Card 
                className="cursor-pointer hover:shadow-xl transition-all hover:scale-105"
                onClick={() => handleChoice('declined')}
              >
                <CardContent className="p-8 text-center">
                  <div className="text-5xl mb-4">😔</div>
                  <h3 className="text-xl font-semibold mb-2">En voi osallistua</h3>
                  <p className="text-sm text-gray-600">Valitettavasti en pääse</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="mt-8 border-2" style={{ borderColor: theme.colors.primary }}>
              <CardContent className="p-8 text-center">
                <div 
                  className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-white"
                  style={{ backgroundColor: theme.colors.primary }}
                >
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-semibold mb-2">
                  {selected === 'accepted' ? 'Kiitos vastauksestasi!' : 'Kiitos ilmoituksestasi'}
                </h3>
                <p className="text-gray-600">
                  {selected === 'accepted' 
                    ? 'Nähdään häissä! 💕' 
                    : 'Toivottavasti näemme toisella kertaa!'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </BlockWrapper>
  );
}

// Default data for new RSVP blocks
export const rsvpBlockDefaults = {
  title: "Vahvista Osallistumisesi",
  description: "Ilmoitathan meille osallistumisestasi viimeistään 1.6.2024"
};
