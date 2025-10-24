"use client";

import { use } from "react";
import { WeddingSiteBuilder } from "@/components/wedding-site-builder";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Eye } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HaasivuMuokkausPage({ params }) {
  const router = useRouter();
  const { id: siteId } = use(params);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Top Bar */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/haasivut/${siteId}`}>
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Takaisin
              </Button>
            </Link>
            <div className="text-white font-medium">
              Ikimetsä - Muokkaus
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600">
              <Eye className="h-4 w-4 mr-2" />
              Esikatselu
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
              <Save className="h-4 w-4 mr-2" />
              Tallenna
            </Button>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="h-[calc(100vh-57px)] max-w-[1600px] mx-auto">
        <WeddingSiteBuilder fullscreen={true} />
      </div>
    </div>
  );
}
