"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronRight, Palette, Type, Link as LinkIcon, AlignLeft } from "lucide-react";
import ColorPicker from "./ColorPicker";
import FontSelector from "./FontSelector";
import { Separator } from "@/components/ui/separator";

// Global Styles Editor - Ulkoasu tab
export default function GlobalStylesEditor({ template, onUpdate }) {
  const [styles, setStyles] = useState(template?.globalStyles || null);

  useEffect(() => {
    if (template?.globalStyles) {
      setStyles(template.globalStyles);
    }
  }, [template]);

  if (!template?.globalStyles) {
    return (
      <div className="p-8 text-center">
        <div className="text-4xl mb-4">🎨</div>
        <h3 className="text-lg font-semibold mb-2">Ei globaaleja tyylejä</h3>
        <p className="text-sm text-gray-600">
          Tämä template ei tue globaaleja tyyliasetuksia.
        </p>
      </div>
    );
  }

  const handleStyleChange = (category, property, value) => {
    const newStyles = {
      ...styles,
      [category]: {
        ...styles[category],
        [property]: value
      }
    };
    setStyles(newStyles);
    onUpdate(newStyles);
  };

  const styleCategories = [
    {
      key: 'background',
      title: 'Tausta',
      icon: Palette,
      description: 'Yleinen taustaväri kaikille lohkoille'
    },
    {
      key: 'textBlock',
      title: 'Tekstikappale',
      icon: AlignLeft,
      description: 'Perusteksti, kappaleet, sisältö'
    },
    {
      key: 'largeHeadings',
      title: 'Suuret otsikot',
      icon: Type,
      description: 'H1-tasoiset pääotsikot'
    },
    {
      key: 'mediumHeadings',
      title: 'Keskikokoiset otsikot',
      icon: Type,
      description: 'H2-H3 tasoiset alaotsikot'
    },
    {
      key: 'smallHeadings',
      title: 'Pienet otsikot',
      icon: Type,
      description: 'H4-H5 tasoiset pienet otsikot'
    },
    {
      key: 'links',
      title: 'Linkit',
      icon: LinkIcon,
      description: 'Hyperlinkit ja navigaatio'
    }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Palette className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-purple-900 mb-1">
              Globaalit tyyliasetukset - {template.name}
            </h3>
            <p className="text-xs text-purple-700">
              Nämä asetukset vaikuttavat kaikkiin lohkoihin joissa vastaavia elementtejä käytetään.
              Jos olet muokannut yksittäisen lohkon asetuksia, ne eivät ylikirjoitu.
            </p>
          </div>
        </div>
      </div>

      {/* Style Categories */}
      <div className="space-y-4">
        {styleCategories.map(category => {
          const Icon = category.icon;
          const categoryStyles = styles[category.key];
          
          if (!categoryStyles) return null;

          return (
            <Card key={category.key} className="overflow-hidden">
              <CardHeader className="bg-gray-50 pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Icon className="w-5 h-5 text-purple-600" />
                  {category.title}
                </CardTitle>
                <p className="text-xs text-gray-600 mt-1">{category.description}</p>
              </CardHeader>
              
              <CardContent className="pt-4 space-y-4">
                {/* Color */}
                {categoryStyles.color !== undefined && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs mb-2 block">Väri</Label>
                      <ColorPicker
                        value={categoryStyles.color}
                        onChange={(value) => handleStyleChange(category.key, 'color', value)}
                      />
                    </div>
                    <div className="flex items-end">
                      <div className="text-xs text-gray-500">
                        Nykyinen: <span className="font-mono">{categoryStyles.color}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Font and Size */}
                {categoryStyles.font !== undefined && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs mb-2 block">Fontti</Label>
                      <FontSelector
                        value={categoryStyles.font}
                        onChange={(value) => handleStyleChange(category.key, 'font', value)}
                      />
                    </div>
                    {categoryStyles.size !== undefined && (
                      <div>
                        <Label className="text-xs mb-2 block">Koko (px)</Label>
                        <Input
                          type="number"
                          value={categoryStyles.size}
                          onChange={(e) => handleStyleChange(category.key, 'size', parseInt(e.target.value))}
                          min="10"
                          max="100"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Style Options (bold, italic, underline) */}
                <div className="flex gap-3 items-center">
                  {categoryStyles.bold !== undefined && (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={categoryStyles.bold}
                        onChange={(e) => handleStyleChange(category.key, 'bold', e.target.checked)}
                        className="w-4 h-4 text-purple-600 rounded"
                      />
                      <span className="text-xs">Lihavoitu</span>
                    </label>
                  )}
                  {categoryStyles.italic !== undefined && (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={categoryStyles.italic}
                        onChange={(e) => handleStyleChange(category.key, 'italic', e.target.checked)}
                        className="w-4 h-4 text-purple-600 rounded"
                      />
                      <span className="text-xs">Kursiivi</span>
                    </label>
                  )}
                  {categoryStyles.underline !== undefined && (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={categoryStyles.underline}
                        onChange={(e) => handleStyleChange(category.key, 'underline', e.target.checked)}
                        className="w-4 h-4 text-purple-600 rounded"
                      />
                      <span className="text-xs">Alleviivattu</span>
                    </label>
                  )}
                </div>

                {/* Preview */}
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                  <div className="text-xs text-gray-600 mb-2">Esikatselu:</div>
                  <div
                    style={{
                      color: categoryStyles.color,
                      fontSize: categoryStyles.size ? `${categoryStyles.size}px` : undefined,
                      fontWeight: categoryStyles.bold ? 'bold' : 'normal',
                      fontStyle: categoryStyles.italic ? 'italic' : 'normal',
                      textDecoration: categoryStyles.underline ? 'underline' : 'none'
                    }}
                  >
                    {category.title} - Esimerkkiteksti
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Info footer */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-xs text-blue-800">
          <strong>💡 Huom:</strong> Globaalit asetukset eivät korvaa lohkokohtaisia muutoksia.
          Jos olet muokannut tietyn lohkon väriä tai fonttia erikseen, se säilyy sellaisenaan.
        </p>
      </div>
    </div>
  );
}
