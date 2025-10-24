"use client";

import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

// Gallery block
export default function GalleryBlock({ data, theme, animated = false }) {
  const { 
    title, 
    description, 
    images = [], 
    backgroundColor, 
    titleColor 
  } = data;

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
      style={{ backgroundColor: backgroundColor || 'white' }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 
            className={`text-4xl md:text-5xl mb-4 ${theme.fonts.heading}`} 
            style={{ color: titleColor || theme.colors.primary }}
          >
            {title}
          </h2>
          {description && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </div>

        {images.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <Card 
                key={index}
                className="overflow-hidden py-0 hover:shadow-xl transition-all hover:scale-105 cursor-pointer aspect-square"
              >
                <div 
                  className="w-full h-full bg-cover bg-center"
                  style={{ 
                    backgroundImage: image.url ? `url(${image.url})` : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
                  }}
                >
                  {!image.url && (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-5xl">📷</span>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">📸</div>
            <p className="text-gray-500">Lisää kuvia galleriaan</p>
          </motion.div>
        )}
      </div>
    </BlockWrapper>
  );
}

// Default data for new gallery blocks
export const galleryBlockDefaults = {
  title: "Kuvagalleria",
  description: "Muistoja yhteiseltä matkaltamme",
  images: [
    { url: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070", caption: "Romanttinen hetki" },
    { url: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=2070", caption: "Yhdessä" },
    { url: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?q=80&w=2071", caption: "Rakkaus" },
    { url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=2070", caption: "Onnelliset" },
    { url: "https://images.unsplash.com/photo-1529634118570-e5aa47071e0d?q=80&w=2069", caption: "Sormukset" },
    { url: "https://images.unsplash.com/photo-1522413452208-996ff3f3e740?q=80&w=2070", caption: "Juhla" },
  ]
};
