"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowUp, ArrowDown, Edit, Trash2, Plus, Ban, Image, Type, Clock, Calendar, Mail, ImageIcon, Text, Minus, Menu } from "lucide-react";
import { createPortal } from 'react-dom';
import TabbedBlockEditor from './TabbedBlockEditor';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Canvas area with block preview and controls
export default function BuilderCanvas({ blocks, theme, onMoveBlock, onEditBlock, onDeleteBlock, activeIndex = null, onInlineUpdate, onCloseEdit, currentTemplate, showAnchoredEditor = false, onAddBlock }) {
  const [insertModalOpen, setInsertModalOpen] = useState(false);
  const [insertPosition, setInsertPosition] = useState(null);
  const [showInsertGaps, setShowInsertGaps] = useState(false);

  const blockTypes = [
    { id: 'hero', name: 'Hero', description: 'Pääkuva ja otsikko', icon: Image },
    { id: 'heading', name: 'Otsikko', description: 'Tekstin otsikko', icon: Type },
    { id: 'text', name: 'Teksti', description: 'Tekstiblokki', icon: Text },
    { id: 'program', name: 'Ohjelma', description: 'Tapahtumien aikataulu', icon: Calendar },
    { id: 'countdown', name: 'Laskuri', description: 'Aika häihin', icon: Clock },
    { id: 'rsvp', name: 'RSVP', description: 'Osallistumisen vahvistus', icon: Mail },
    { id: 'gallery', name: 'Galleria', description: 'Kuvagalleria', icon: ImageIcon },
    { id: 'divider', name: 'Erotin', description: 'Visuaalinen erottaja', icon: Minus },
    { id: 'spacer', name: 'Tyhjä tila', description: 'Väli osioiden välillä', icon: Ban },
    { id: 'navigation', name: 'Navigaatio', description: 'Navigaation valikko', icon: Menu }
  ];

  const handleAddBlock = (blockType) => {
    if (onAddBlock) {
      onAddBlock(blockType, insertPosition);
    }
    setInsertModalOpen(false);
    setShowInsertGaps(false);
  };

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
    <div className="flex-1 bg-gray-100">
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
        {/* Anchored inline editor under the active block (optional) */}
        {showAnchoredEditor && activeIndex !== null && typeof window !== 'undefined' && createPortal(
          <div className="fixed z-[1000] px-4" style={{ top: '100px', left: '100px' }}>
            {/* Arrow pointing up to the block */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[12px] border-b-white drop-shadow" />

            <TabbedBlockEditor
              inline
              block={blocks[activeIndex]}
              onUpdate={(val) => onInlineUpdate && onInlineUpdate(activeIndex, val)}
              onSave={(val) => onInlineUpdate && onInlineUpdate(activeIndex, val)}
              onCancel={() => onCloseEdit && onCloseEdit()}
              theme={theme}
              currentTemplate={currentTemplate}
            />
          </div>,
          document.body
        )}
        {blocks.map((block, index) => (
          <React.Fragment key={block.id}>
            {/* Insert gaps - shown when showInsertGaps is true */}
            {showInsertGaps && index === 0 && (
              <div className="relative h-8 flex items-center justify-center group/insert">
                <div className="absolute inset-x-0 h-0.5 bg-gray-300"></div>
                <button
                  onClick={() => {
                    setInsertPosition(0);
                    setInsertModalOpen(true);
                  }}
                  className="relative z-10 bg-white border-2 border-gray-300 rounded-full p-1.5 opacity-100 transition-opacity hover:border-pink-500 hover:bg-pink-50"
                  title="Lisää elementti"
                >
                  
                  <Plus className="w-4 h-4 text-gray-600 hover:text-pink-600" />
                </button>
              </div>
            )}
            
            <div 
              className={`relative group ${activeIndex === index ? 'z-[2001]' : ''}`}
              // onMouseLeave={() => {
              //   if (showInsertGaps) setShowInsertGaps(false);
              // }}
            >
            {/* Block controls overlay - Circular buttons */}
            {activeIndex === null && (
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
                  onClick={() => {
                    onEditBlock(index);
                    setShowInsertGaps(false);
                  }}
                  className="w-12 h-12 rounded-full bg-pink-500 shadow-lg hover:shadow-xl transition-all flex items-center justify-center hover:scale-110"
                  title="Muokkaa"
                >
                  <Edit className="w-5 h-5 text-white" />
                </button>
                
                {/* Add block */}
                <button
                  onClick={() => setShowInsertGaps(!showInsertGaps)}
                  className="w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center hover:scale-110"
                  title="Lisää elementti"
                >
                  {!showInsertGaps ? <Plus className="w-5 h-5 text-gray-700" /> : <Ban className="w-5 h-5 text-gray-700" />}
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
            )}

            {/* Block type badge */}
            {activeIndex === null && (
            <div className="absolute top-4 left-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-black/70 text-white text-xs px-3 py-1 rounded-full font-medium">
                {block.type.toUpperCase()}
              </div>
            </div>
            )}

            {/* Hover overlay */}
            {activeIndex === null && (
            <div className="absolute inset-0 border-4 border-transparent group-hover:border-pink-500 transition-colors pointer-events-none z-10"></div>
            )}

            {/* Block content */}
            <div>
              {block.component}
            </div>
            </div>

            {/* Insert gap after block */}
            {showInsertGaps && (
              <div className="relative h-8 flex items-center justify-center group/insert">
                <div className="absolute inset-x-0 h-0.5 bg-gray-300"></div>
                <button
                  onClick={() => {
                    setInsertPosition(index + 1);
                    setInsertModalOpen(true);
                  }}
                  className="relative z-10 bg-white border-2 border-gray-300 rounded-full p-1.5 opacity-100 transition-opacity hover:border-pink-500 hover:bg-pink-50"
                  title="Lisää elementti"
                >
                  <Plus className="w-4 h-4 text-gray-600 hover:text-pink-600" />
                </button>
              </div>
            )}
          </React.Fragment>
        ))}

        {/* Insert gap at the end */}
        {showInsertGaps && blocks.length > 0 && (
          <div className="relative h-8 flex items-center justify-center group/insert">
            <div className="absolute inset-x-0 h-0.5 bg-gray-300"></div>
            <button
              onClick={() => {
                setInsertPosition(blocks.length);
                setInsertModalOpen(true);
              }}
              className="relative z-10 bg-white border-2 border-gray-300 rounded-full p-1.5 opacity-100 transition-opacity hover:border-pink-500 hover:bg-pink-50"
              title="Lisää elementti"
            >
              <Plus className="w-4 h-4 text-gray-600 hover:text-pink-600" />
            </button>
          </div>
        )}
      </div>

      {/* Insert block modal */}
      <Dialog open={insertModalOpen} onOpenChange={setInsertModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Lisää uusi elementti</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto pr-4">
            {blockTypes.map((blockType) => {
              const IconComponent = blockType.icon;
              return (
                <button
                  key={blockType.id}
                  onClick={() => handleAddBlock(blockType.id)}
                  className="group relative p-6 border-2 border-gray-200 rounded-xl hover:border-pink-400 hover:shadow-lg transition-all text-left bg-white hover:bg-gradient-to-br hover:from-pink-50 hover:to-purple-50"
                >
                  {/* Icon background */}
                  <div className="mb-3 inline-flex p-3 rounded-lg bg-gradient-to-br from-pink-100 to-purple-100 group-hover:from-pink-200 group-hover:to-purple-200 transition-all">
                    <IconComponent className="w-6 h-6 text-pink-600" />
                  </div>
                  
                  {/* Text content */}
                  <div className="font-bold text-gray-900 text-lg mb-1">{blockType.name}</div>
                  <div className="text-sm text-gray-600 leading-relaxed">{blockType.description}</div>
                  
                  {/* Hover indicator */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus className="w-5 h-5 text-pink-500" />
                  </div>
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
