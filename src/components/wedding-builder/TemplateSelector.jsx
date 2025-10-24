"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getAllTemplates } from "@/lib/website-templates";

// Template Selector Modal
export default function TemplateSelector({ open, onOpenChange, onSelectTemplate }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const templates = getAllTemplates();

  const handleSelect = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">Valitse sivupohja</DialogTitle>
          <p className="text-center text-gray-600">
            Aloita uuden hääsivuston luominen valitsemalla valmis sivupohja
          </p>
        </DialogHeader>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
          {templates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                relative border-2 rounded-xl overflow-hidden cursor-pointer
                transition-all duration-300 hover:shadow-2xl
                ${selectedTemplate?.id === template.id
                  ? 'border-pink-500 shadow-xl'
                  : 'border-gray-200 hover:border-pink-300'}
              `}
              onClick={() => setSelectedTemplate(template)}
              style={{ backgroundColor: template.theme.colors.accent + '20' }}
            >
              {/* Selected Checkmark */}
              {selectedTemplate?.id === template.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 right-4 z-10 bg-pink-500 text-white rounded-full p-2"
                >
                  <Check className="w-6 h-6" />
                </motion.div>
              )}

              {/* Preview Box */}
              <div
                className="h-80 flex items-center justify-center relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${template.theme.colors.primary} 0%, ${template.theme.colors.secondary} 100%)`
                }}
              >
                {/* Decorative Elements Based on Template */}
                {template.id === 'ikimetsa' && (
                  <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1200 200" className="w-full">
                      <path
                        d="M0,100 L50,80 L100,60 L150,90 L200,70 L250,50 L300,80 L350,60 L400,40 L450,70 L500,50 L550,30 L600,60 L650,40 L700,60 L750,80 L800,60 L850,80 L900,100 L950,80 L1000,90 L1050,70 L1100,90 L1150,100 L1200,110 L1200,200 L0,200 Z"
                        fill="#1a3a0f"
                        opacity="0.8"
                      />
                      <path
                        d="M0,120 L80,100 L160,80 L240,110 L320,90 L400,70 L480,100 L560,80 L640,60 L720,90 L800,70 L880,90 L960,110 L1040,90 L1120,100 L1200,120 L1200,200 L0,200 Z"
                        fill="#0f2408"
                        opacity="0.9"
                      />
                    </svg>
                  </div>
                )}

                {template.id === 'benvenuto' && (
                  <>
                    {/* Overlay for better text visibility */}
                    <div className="absolute inset-0 bg-black/30" />
                    {/* Background Image Preview */}
                    <div
                      className="absolute inset-0 opacity-50"
                      style={{
                        backgroundImage: 'url(https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    />
                  </>
                )}

                {/* Template Title on Preview */}
                <div className="relative z-10 text-center text-white px-8">
                  <motion.h2
                    className={`text-5xl font-bold mb-3 ${template.theme.fonts.heading}`}
                    style={{ textShadow: '0 4px 20px rgba(0,0,0,0.4)' }}
                  >
                    {template.name}
                  </motion.h2>
                  <p
                    className="text-xl opacity-95"
                    style={{ textShadow: '0 2px 10px rgba(0,0,0,0.4)' }}
                  >
                    Elina & Akseli
                  </p>
                </div>
              </div>

              {/* Template Info */}
              <div className="p-4 bg-white">
                <h3 className="text-2xl font-bold">{template.name}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Peruuta
          </Button>
          <Button
            onClick={handleSelect}
            disabled={!selectedTemplate}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:opacity-50"
          >
            {selectedTemplate ? `Valitse ${selectedTemplate.name}` : 'Valitse sivupohja'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
