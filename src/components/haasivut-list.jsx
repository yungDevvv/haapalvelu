"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { staggerContainer, staggerItem, hoverLift } from "@/lib/animations";
import TemplateSelector from "./wedding-builder/TemplateSelector";

// Mock data for wedding sites
const weddingSites = [
  {
    id: 1,
    name: "Ikimetsä",
    theme: "forest",
    published: false,
    thumbnail: "/api/placeholder/400/300",
    url: "ikimetsa",
    createdAt: "2024-01-15"
  }
];

export function HaasivutList() {
  const router = useRouter();
  const [templateSelectorOpen, setTemplateSelectorOpen] = useState(false);

  const handleSelectTemplate = (template) => {
    // Create new site with selected template
    console.log('Selected template:', template);
    // TODO: Create site in backend and navigate to builder
    // For now, just navigate to builder with template data
    router.push(`/builder?template=${template.id}`);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            Hääsivut
          </h2>
          <p className="text-sm text-gray-600 mt-1">Luo ja hallinnoi hääsivustoja</p>
        </div>
        <Button 
          onClick={() => setTemplateSelectorOpen(true)}
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Luo hääsivu
        </Button>
      </div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {weddingSites.map((site) => (
          <motion.div key={site.id} variants={staggerItem} whileHover={hoverLift}>
            <Link href={`/haasivut/${site.id}`}>
              <Card className="cursor-pointer transition-shadow hover:shadow-lg overflow-hidden !p-0 gap-0">
                <div className="aspect-video bg-gradient-to-br from-green-100 to-green-50 relative">
                  {/* Site preview thumbnail */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-6">
                      <div className="text-3xl mb-2">🌲</div>
                      <h3 className="text-2xl font-light text-gray-700">{site.name}</h3>
                    </div>
                  </div>
                  
                  {/* Status badge */}
                  {!site.published && (
                    <div className="absolute top-3 right-3">
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                        Ei julkaistu
                      </span>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800">{site.name}</h3>
                      <p className="text-xs text-gray-500">Luotu {site.createdAt}</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}

        {/* Create new site card */}
        <motion.div variants={staggerItem} whileHover={hoverLift}>
          <div onClick={() => setTemplateSelectorOpen(true)} className="h-full">
            <Card className="cursor-pointer transition-shadow hover:shadow-lg border-2 border-dashed border-gray-300 bg-white/50">
              <CardContent className="aspect-video flex flex-col items-center justify-center p-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center mb-4">
                  <Plus className="h-8 w-8 text-pink-500" />
                </div>
                <h3 className="font-semibold text-gray-700 mb-2">Luo hääsivu</h3>
                <p className="text-sm text-gray-500 text-center">
                  Aloita uuden hääsivuston luominen
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </motion.div>

      {/* Template Selector Modal */}
      <TemplateSelector
        open={templateSelectorOpen}
        onOpenChange={setTemplateSelectorOpen}
        onSelectTemplate={handleSelectTemplate}
      />
    </div>
  );
}
