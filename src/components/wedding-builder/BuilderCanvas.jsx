"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowUp, ArrowDown, Edit, Trash2 } from "lucide-react";

// Canvas area with block preview and controls
export default function BuilderCanvas({ blocks, theme, onMoveBlock, onEditBlock, onDeleteBlock }) {
  if (blocks.length === 0) {
    return (
      <div className="flex-1 bg-gray-50 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">💒</div>
          <h3 className="text-2xl font-semibold mb-2 text-gray-700">
            Aloita Sivun Rakentaminen
          </h3>
          <p className="text-gray-500">
            Valitse vasemmalta lohko jonka haluat lisätä sivullesi. 
            Voit lisätä niin monta lohkoa kuin haluat ja järjestellä niitä vapaasti.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-100 overflow-y-auto">
      {/* Browser mockup bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="flex-1 mx-4 bg-gray-100 rounded px-3 py-1 text-sm text-gray-600">
          @ Esikatselu
        </div>
      </div>

      {/* Blocks preview */}
      <div className="relative">
        {blocks.map((block, index) => (
          <div 
            key={block.id} 
            className="relative group"
          >
            {/* Block controls overlay - Circular buttons */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-3">
                {/* Move up */}
                {index > 0 && (
                  <button
                    onClick={() => onMoveBlock(index, 'up')}
                    className="w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center hover:scale-110"
                    title="Ylös"
                  >
                    <ArrowUp className="w-5 h-5 text-gray-700" />
                  </button>
                )}
                
                {/* Move down */}
                {index < blocks.length - 1 && (
                  <button
                    onClick={() => onMoveBlock(index, 'down')}
                    className="w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center hover:scale-110"
                    title="Alas"
                  >
                    <ArrowDown className="w-5 h-5 text-gray-700" />
                  </button>
                )}
                
                {/* Edit */}
                <button
                  onClick={() => onEditBlock(index)}
                  className="w-12 h-12 rounded-full bg-pink-500 shadow-lg hover:shadow-xl transition-all flex items-center justify-center hover:scale-110"
                  title="Muokkaa"
                >
                  <Edit className="w-5 h-5 text-white" />
                </button>
                
                {/* Delete */}
                <button
                  onClick={() => onDeleteBlock(index)}
                  className="w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center hover:scale-110 hover:bg-red-50"
                  title="Poista"
                >
                  <Trash2 className="w-5 h-5 text-red-600" />
                </button>
              </div>
            </div>

            {/* Block type badge */}
            <div className="absolute top-4 left-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-black/70 text-white text-xs px-3 py-1 rounded-full font-medium">
                {block.type.toUpperCase()}
              </div>
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 border-4 border-transparent group-hover:border-pink-500 transition-colors pointer-events-none z-10"></div>

            {/* Block content */}
            <div>
              {block.component}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
