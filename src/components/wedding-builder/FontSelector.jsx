"use client";

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getFontsByCategory, getFontClass } from "@/lib/wedding-fonts";

// Font selector component with preview
export default function FontSelector({ value, onChange, placeholder = "Valitse fontti" }) {
  const fontsByCategory = getFontsByCategory();

  return (
    <Select value={value || ""} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="max-h-[400px] z-[2002]">
        {Object.entries(fontsByCategory).map(([category, fonts]) => (
          <SelectGroup key={category}>
            <SelectLabel className="text-xs font-semibold text-gray-500 px-2 py-1">
              {category}
            </SelectLabel>
            {fonts.map((font) => (
              <SelectItem 
                key={font.value} 
                value={font.value}
                className="cursor-pointer"
              >
                <span className={font.className} style={{ fontFamily: font.label }}>
                  {font.label}
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}

// Compact font selector with just the select
export function FontSelectorCompact({ value, onChange, label }) {
  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium">{label}</label>}
      <FontSelector value={value} onChange={onChange} />
    </div>
  );
}
