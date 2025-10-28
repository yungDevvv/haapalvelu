"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { getTheme } from "@/lib/wedding-themes";
import HeroBlock from "@/components/wedding-builder/blocks/HeroBlock";
import HeadingBlock from "@/components/wedding-builder/blocks/HeadingBlock";
import CountdownBlock from "@/components/wedding-builder/blocks/CountdownBlock";
import ProgramBlock from "@/components/wedding-builder/blocks/ProgramBlock";
import RSVPBlock from "@/components/wedding-builder/blocks/RSVPBlock";
import GalleryBlock from "@/components/wedding-builder/blocks/GalleryBlock";
import TextBlock from "@/components/wedding-builder/blocks/TextBlock";
import DividerBlock from "@/components/wedding-builder/blocks/DividerBlock";
import SpacerBlock from "@/components/wedding-builder/blocks/SpacerBlock";
import NavigationBlock from "@/components/wedding-builder/blocks/NavigationBlock";

// Preview page with animations
export default function PreviewPage() {
  const searchParams = useSearchParams();
  const [pageData, setPageData] = useState(null);

  useEffect(() => {
    // Get data from localStorage (in real app would be from URL params or API)
    const savedData = localStorage.getItem('wedding-builder-preview');
    if (savedData) {
      setPageData(JSON.parse(savedData));
    }
  }, []);

  if (!pageData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">💒</div>
          <p className="text-gray-600">Ladataan esikatselua...</p>
        </div>
      </div>
    );
  }

  const theme = getTheme(pageData.theme);

  return (
    <div className="min-h-screen bg-white">
      {pageData.blocks.map((block, index) => {
        let Component;
        switch (block.type) {
          case 'hero':
            Component = HeroBlock;
            break;
          case 'heading':
            Component = HeadingBlock;
            break;
          case 'countdown':
            Component = CountdownBlock;
            break;
          case 'program':
            Component = ProgramBlock;
            break;
          case 'rsvp':
            Component = RSVPBlock;
            break;
          case 'gallery':
            Component = GalleryBlock;
            break;
          case 'text':
            Component = TextBlock;
            break;
          case 'divider':
            Component = DividerBlock;
            break;
          case 'spacer':
            Component = SpacerBlock;
            break;
          case 'navigation':
            Component = NavigationBlock;
            break;
          default:
            return null;
        }

        return (
          <Component
            key={block.id}
            data={block.data}
            theme={theme}
            animated={true}
          />
        );
      })}
     
    </div>
  );
}
