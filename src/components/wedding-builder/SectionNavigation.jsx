"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link, Edit, Trash2, Eye, EyeOff } from "lucide-react";

// Section navigation component - shows links to all blocks
export default function SectionNavigation({ blocks, onUpdateBlock, onDeleteBlock }) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed top-24 right-4 z-30 w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
        title="Näytä navigaatio"
      >
        <Eye className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed top-24 right-4 z-30 max-w-xs">
      
    </div>
  );
}

// Helper functions
function getBlockTitle(block) {
  switch (block.type) {
    case 'hero':
      return block.data.title || 'Hero';
    case 'countdown':
      return block.data.title || 'Countdown';
    case 'program':
      return block.data.title || 'Ohjelma';
    case 'rsvp':
      return block.data.title || 'RSVP';
    case 'gallery':
      return block.data.title || 'Galleria';
    case 'text':
      return block.data.title || 'Teksti';
    default:
      return 'Lohko';
  }
}

function getBlockTypeLabel(type) {
  const labels = {
    hero: 'Hero',
    countdown: 'Ajastin',
    program: 'Ohjelma',
    rsvp: 'Ilmoittautuminen',
    gallery: 'Galleria',
    text: 'Tekstiä'
  };
  return labels[type] || type;
}
