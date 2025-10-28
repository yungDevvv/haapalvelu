"use client";

import { Clock, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

// Program/timeline block with style variants
export default function ProgramBlock({ data, theme, animated = false }) {
  const { 
    title, 
    description, 
    events = [], 
    backgroundColor, 
    titleColor, 
    descriptionColor,
    cardColor,
    accentColor,
    styleVariant = 'classic', // classic, timeline, cards, minimal
    paddingY = 20,
    paddingX = 16
  } = data;

  const animationProps = animated ? {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6, ease: "easeOut" }
  } : {};

  // Render based on style variant
  const renderContent = () => {
    switch (styleVariant) {
      case 'timeline':
        return renderTimelineStyle();
      case 'cards':
        return renderCardsStyle();
      case 'minimal':
        return renderMinimalStyle();
      case 'classic':
      default:
        return renderClassicStyle();
    }
  };

  // Classic style with circular time badges
  const renderClassicStyle = () => (
    <div className="max-w-3xl mx-auto space-y-4">
      {events.map((event, index) => (
        <Card 
          key={index} 
          className="hover:shadow-lg transition-shadow"
          style={{ backgroundColor: cardColor || 'white' }}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-base"
                  style={{ backgroundColor: accentColor || titleColor || theme.colors.primary }}
                >
                  {event.time}
                </div>
              </div>
              <div className="flex-1">
                <h3 
                  className="text-lg font-bold mb-2" 
                  style={{ color: titleColor || theme.colors.primary }}
                >
                  {event.title}
                </h3>
                {event.description && (
                  <p 
                    className="text-base mb-2 leading-relaxed"
                    style={{ color: descriptionColor || '#6b7280' }}
                  >
                    {event.description}
                  </p>
                )}
                {event.location && (
                  <div 
                    className="flex items-center gap-2 text-sm"
                    style={{ color: descriptionColor || '#6b7280', opacity: 0.7 }}
                  >
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Timeline style with vertical line
  const renderTimelineStyle = () => (
    <div className="max-w-3xl mx-auto relative">
      {/* Vertical timeline line */}
      <div 
        className="absolute left-8 top-0 bottom-0 w-0.5"
        style={{ backgroundColor: accentColor || theme.colors.primary, opacity: 0.3 }}
      />
      
      <div className="space-y-8">
        {events.map((event, index) => (
          <div key={index} className="relative pl-20">
            {/* Time dot */}
            <div 
              className="absolute left-0 w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-sm border-4"
              style={{ 
                backgroundColor: accentColor || titleColor || theme.colors.primary,
                borderColor: backgroundColor || 'white'
              }}
            >
              {event.time}
            </div>
            
            {/* Event card */}
            <Card 
              className="hover:shadow-lg transition-shadow"
              style={{ backgroundColor: cardColor || 'white' }}
            >
              <CardContent className="p-4">
                <h3 
                  className="text-lg font-bold mb-2" 
                  style={{ color: titleColor || theme.colors.primary }}
                >
                  {event.title}
                </h3>
                {event.description && (
                  <p 
                    className="text-base mb-2 leading-relaxed"
                    style={{ color: descriptionColor || '#6b7280' }}
                  >
                    {event.description}
                  </p>
                )}
                {event.location && (
                  <div 
                    className="flex items-center gap-2 text-sm"
                    style={{ color: descriptionColor || '#6b7280', opacity: 0.7 }}
                  >
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );

  // Simple cards style
  const renderCardsStyle = () => (
    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-4">
      {events.map((event, index) => (
        <Card 
          key={index} 
          className="hover:shadow-lg transition-shadow"
          style={{ backgroundColor: cardColor || 'white' }}
        >
          <CardContent className="p-6">
            <div 
              className="inline-block px-3 py-1 rounded-full text-sm font-bold text-white mb-3"
              style={{ backgroundColor: accentColor || titleColor || theme.colors.primary }}
            >
              {event.time}
            </div>
            <h3 
              className="text-xl font-bold mb-2" 
              style={{ color: titleColor || theme.colors.primary }}
            >
              {event.title}
            </h3>
            {event.description && (
              <p 
                className="text-base mb-2"
                style={{ color: descriptionColor || '#6b7280' }}
              >
                {event.description}
              </p>
            )}
            {event.location && (
              <div 
                className="flex items-center gap-2 text-sm mt-3"
                style={{ color: descriptionColor || '#6b7280', opacity: 0.7 }}
              >
                <MapPin className="w-4 h-4" />
                <span>{event.location}</span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Minimal list style
  const renderMinimalStyle = () => (
    <div className="max-w-2xl mx-auto">
      {events.map((event, index) => (
        <div 
          key={index} 
          className="py-6 border-b last:border-b-0 hover:bg-gray-50/50 transition-colors px-4"
          style={{ borderColor: accentColor || theme.colors.primary, borderOpacity: 0.1 }}
        >
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div 
              className="text-2xl font-bold flex-shrink-0 md:w-24"
              style={{ color: accentColor || titleColor || theme.colors.primary }}
            >
              {event.time}
            </div>
            <div className="flex-1">
              <h3 
                className="text-xl font-bold mb-1" 
                style={{ color: titleColor || theme.colors.primary }}
              >
                {event.title}
              </h3>
              {event.description && (
                <p 
                  className="text-base mb-2"
                  style={{ color: descriptionColor || '#6b7280' }}
                >
                  {event.description}
                </p>
              )}
              {event.location && (
                <div 
                  className="flex items-center gap-2 text-sm"
                  style={{ color: descriptionColor || '#6b7280', opacity: 0.7 }}
                >
                  <MapPin className="w-4 h-4" />
                  <span>{event.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

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
        {(title || description) && (
          <div className="text-center mb-12">
            {title && (
              <h2 
                className={`text-4xl md:text-5xl mb-4 ${theme.fonts.heading}`} 
                style={{ color: titleColor || theme.colors.primary }}
              >
                {title}
              </h2>
            )}
            {description && (
              <p 
                className="text-lg max-w-2xl mx-auto"
                style={{ color: descriptionColor || '#6b7280' }}
              >
                {description}
              </p>
            )}
          </div>
        )}

        {renderContent()}
      </ContentWrapper>
    </div>
  );
}

// Default data for new program blocks
export const programBlockDefaults = {
  title: "",
  description: "",
  styleVariant: 'classic',
  paddingY: 20,
  paddingX: 16,
  events: [
    {
      time: "15:00",
      title: "Vihkiminen",
      description: "Kirkossa pidettävä vihkiseremonia",
      location: "Tuomiokirkko"
    },
    {
      time: "17:00",
      title: "Vastaanotto",
      description: "Cocktailit ja tervetulojuomat",
      location: "Juhlasali"
    },
    {
      time: "18:00",
      title: "Illallinen",
      description: "Hääillallinen ja puheet",
      location: "Juhlasali"
    },
    {
      time: "21:00",
      title: "Tanssiaiset",
      description: "Tanssia ja juhlimista aamuun asti",
      location: "Juhlasali"
    }
  ]
};
