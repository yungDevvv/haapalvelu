"use client";

import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Beautiful color picker component
export default function ColorPicker({ value, onChange, placeholder = "#ffffff" }) {
  const [open, setOpen] = useState(false);
  const displayColor = value || placeholder;

  return (
    <div className="flex gap-2">
      {/* Color preview button */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-20 h-10 p-1"
            style={{ backgroundColor: displayColor }}
          >
            <div 
              className="w-full h-full rounded border-2 border-white shadow-sm"
              style={{ backgroundColor: displayColor }}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3 z-[2002]" align="start">
          <HexColorPicker color={displayColor} onChange={onChange} />
          
          {/* Quick preset colors */}
          <div className="mt-3 pt-3 border-t">
            <p className="text-xs text-gray-500 mb-2">Pikavärit:</p>
            <div className="grid grid-cols-6 gap-2">
              {[
                '#e91e63', '#f48fb1', '#fce4ec', // Pink shades
                '#9c27b0', '#ba68c8', '#f3e5f5', // Purple shades
                '#2196f3', '#64b5f6', '#e3f2fd', // Blue shades
                '#4caf50', '#81c784', '#e8f5e9', // Green shades
                '#ff9800', '#ffb74d', '#fff3e0', // Orange shades
                '#607d8b', '#90a4ae', '#eceff1', // Gray shades
              ].map((color) => (
                <button
                  key={color}
                  type="button"
                  className="w-8 h-8 rounded border-2 border-gray-200 hover:border-pink-500 transition-colors"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    onChange(color);
                    setOpen(false);
                  }}
                />
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Hex input */}
      <Input 
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 font-mono"
        maxLength={7}
      />
    </div>
  );
}
