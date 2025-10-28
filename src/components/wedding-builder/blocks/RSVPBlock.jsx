"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

// RSVP form block
export default function RSVPBlock({ data, theme, animated = false }) {
  const { 
    backgroundColor, 
    buttonColor,
    styleVariant = 'cards',
    paddingY = 20,
    paddingX = 16
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

  const ContentWrapper = animated ? motion.div : 'div';

  return (
    <div
      style={{ 
        backgroundColor: backgroundColor || `bg-gradient-to-br ${theme.gradients.section}`,
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
        <div className="max-w-2xl mx-auto text-center">
          {!selected ? (
            styleVariant === 'buttons' ? (
              <div className="flex flex-col md:flex-row gap-4 mt-8 justify-center max-w-lg mx-auto">
                <Button
                  onClick={() => handleChoice('accepted')}
                  className="flex-1 py-6 text-lg"
                  style={{ backgroundColor: buttonColor || theme.colors.primary }}
                >
                  Tulen häihin
                </Button>
                <Button
                  onClick={() => handleChoice('declined')}
                  variant="outline"
                  className="flex-1 py-6 text-lg"
                >
                  En voi osallistua
                </Button>
              </div>
            ) : styleVariant === 'minimal' ? (
              <div className="flex flex-col md:flex-row gap-3 mt-8 justify-center max-w-lg mx-auto">
                <button
                  onClick={() => handleChoice('accepted')}
                  className="px-6 py-3 text-center font-semibold rounded-lg transition-all hover:shadow-md"
                  style={{ backgroundColor: buttonColor || theme.colors.primary, color: 'white' }}
                >
                  Tulen häihin
                </button>
                <button
                  onClick={() => handleChoice('declined')}
                  className="px-6 py-3 text-center font-semibold rounded-lg border-2 transition-all hover:shadow-md"
                  style={{ borderColor: buttonColor || theme.colors.primary, color: buttonColor || theme.colors.primary }}
                >
                  En voi osallistua
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                <Card 
                  className="cursor-pointer hover:shadow-xl transition-all hover:scale-105"
                  onClick={() => handleChoice('accepted')}
                >
                  <CardContent className="p-8 text-center">
                    <div className="w-12 h-12 rounded-full mx-auto mb-4" style={{ backgroundColor: buttonColor || theme.colors.primary }}></div>
                    <h3 className="text-xl font-semibold mb-2">Tulen häihin</h3>
                    <p className="text-sm text-gray-600">Vahvista osallistumisesi</p>
                  </CardContent>
                </Card>

                <Card 
                  className="cursor-pointer hover:shadow-xl transition-all hover:scale-105"
                  onClick={() => handleChoice('declined')}
                >
                  <CardContent className="p-8 text-center">
                    <div className="w-12 h-12 rounded-full mx-auto mb-4 border-2" style={{ borderColor: buttonColor || theme.colors.primary }}></div>
                    <h3 className="text-xl font-semibold mb-2">En voi osallistua</h3>
                    <p className="text-sm text-gray-600">Valitettavasti en pääse</p>
                  </CardContent>
                </Card>
              </div>
            )
          ) : (
            <Card className=" border-2" style={{ borderColor: theme.colors.primary }}>
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
                    ? 'Nähdään häissä!' 
                    : 'Toivottavasti näemme toisella kertaa!'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </ContentWrapper>
    </div>
  );
}

// Default data for new RSVP blocks
export const rsvpBlockDefaults = {
  styleVariant: 'cards',
  paddingY: 20,
  paddingX: 16
};
