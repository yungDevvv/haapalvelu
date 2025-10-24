"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Image, 
  Clock, 
  Calendar, 
  Mail, 
  ImageIcon,
  Text,
  Type,
  Palette,
  Minus
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sidebar with blocks and theme selector
export default function BlocksSidebar({ onAddBlock, currentTheme, onThemeChange, currentTemplate }) {
  const blocks = [
    {
      type: 'hero',
      icon: Image,
      label: 'Hero',
      description: 'Etusivu kuvalla'
    },
    {
      type: 'heading',
      icon: Type,
      label: 'Otsikko',
      description: 'Otsikko'
    },
    {
      type: 'countdown',
      icon: Clock,
      label: 'Countdown',
      description: 'Ajastin häihin'
    },
    {
      type: 'program',
      icon: Calendar,
      label: 'Ohjelma',
      description: 'Päivän aikataulu'
    },
    {
      type: 'rsvp',
      icon: Mail,
      label: 'RSVP',
      description: 'Vahvistuslomake'
    },
    {
      type: 'gallery',
      icon: ImageIcon,
      label: 'Galleria',
      description: 'Kuvagalleria'
    },
    {
      type: 'text',
      icon: Text,
      label: 'Teksti',
      description: 'Vapaa tekstiosio'
    },
    {
      type: 'divider',
      icon: Minus,
      label: 'Erotin',
      description: 'Visuaalinen erotin'
    }
  ];

  return (
    <div className="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto">
      <div className="space-y-6">
        {/* Theme selector */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Teema
          </h3>
          <Select value={currentTheme} onValueChange={onThemeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Valitse teema" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="romantic">💕 Romanttinen</SelectItem>
              <SelectItem value="forest">🌲 Metsä</SelectItem>
              <SelectItem value="elegant">👑 Elegantti</SelectItem>
              <SelectItem value="beach">🌊 Ranta</SelectItem>
              <SelectItem value="rustic">🍂 Rustiikki</SelectItem>
              <SelectItem value="minimalist">⚪ Minimalistinen</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200"></div>

        {/* Block buttons */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Lisää Lohko</h3>
          <div className="space-y-2">
            {blocks.map((block) => {
              const Icon = block.icon;
              return (
                <Card 
                  key={block.type}
                  className="cursor-pointer hover:shadow-md hover:border-pink-300 transition-all"
                  onClick={() => onAddBlock(block.type)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm">{block.label}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{block.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Template Info */}
        {currentTemplate?.blockDefaults && (
          <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-start gap-2">
              <span className="text-purple-600 text-lg">✨</span>
              <div className="flex-1">
                <p className="text-xs font-semibold text-purple-900 mb-1">
                  Template-asetukset aktiivisina
                </p>
                <p className="text-xs text-purple-700">
                  Uudet lohkot käyttävät automaattisesti <strong>{currentTemplate.name}</strong> template-tyylejä 
                  (fontit, värit, tilat).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-800">
            💡 <strong>Vinkki:</strong> Klikkaa lohkoa lisätäksesi sen sivulle. 
            Voit järjestellä ja muokata lohkoja esikatselu-alueella.
          </p>
        </div>
      </div>
    </div>
  );
}
