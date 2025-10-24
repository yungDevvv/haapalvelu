"use client";

import { motion } from "framer-motion";
import { Heart, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-8 max-w-md"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1
          }}
        >
          <Heart className="h-32 w-32 mx-auto text-pink-400" />
        </motion.div>

        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-gray-800">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700">
            Sivua ei löytynyt
          </h2>
          <p className="text-gray-600">
            Valitettavasti etsimääsi häiden sivua ei ole olemassa tai sitä ei ole vielä julkaistu.
          </p>
        </div>

        <Link href="/">
          <Button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
            <Home className="h-4 w-4 mr-2" />
            Palaa etusivulle
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
