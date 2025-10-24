"use client";

import { use, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWedding } from "@/contexts/wedding-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Lock, Heart, Calendar, MapPin, Users, Clock, CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PublicWeddingSitePage({ params }) {
  const { url } = use(params);
  const router = useRouter();
  
  const { weddingSite, couple } = useWedding();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [rsvpStatus, setRsvpStatus] = useState(null);

  // Check if no password protection, authenticate immediately
  useEffect(() => {
    if (!weddingSite.passwordProtected) {
      setIsAuthenticated(true);
    }
  }, [weddingSite.passwordProtected]);

  // Check if site exists and is published
  if (!weddingSite.published || weddingSite.url !== url) {
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
        </motion.div>
      </div>
    );
  }

  // Handle password submission
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    
    if (passwordInput === weddingSite.accessCode) {
      setIsAuthenticated(true);
      setPasswordError("");
    } else {
      setPasswordError("Virheellinen koodi. Yritä uudelleen.");
      setPasswordInput("");
    }
  };

  // Handle RSVP
  const handleRsvp = (status) => {
    setRsvpStatus(status);
    // Here would be actual RSVP logic
    alert(`Kiitos vastauksestasi! ${status === "tulossa" ? "Nähdään häissä! 🎉" : "Kiitos ilmoituksesta."}`);
  };

  // Theme colors based on site theme
  const themeColors = {
    forest: {
      primary: "from-green-600 to-green-800",
      secondary: "from-green-100 to-green-50",
      accent: "bg-green-600",
      text: "text-green-800"
    },
    romantic: {
      primary: "from-pink-500 to-rose-600",
      secondary: "from-pink-100 to-rose-50",
      accent: "bg-pink-500",
      text: "text-pink-800"
    },
    elegant: {
      primary: "from-purple-600 to-indigo-700",
      secondary: "from-purple-100 to-indigo-50",
      accent: "bg-purple-600",
      text: "text-purple-800"
    }
  };

  const theme = themeColors[weddingSite.theme] || themeColors.forest;

  // If not authenticated, show password form
  if (weddingSite.passwordProtected && !isAuthenticated) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${theme.secondary} flex items-center justify-center p-4`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-md shadow-2xl">
            <CardContent className="p-8 space-y-6">
              <div className="text-center space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  <Lock className={`h-16 w-16 mx-auto ${theme.text}`} />
                </motion.div>
                
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Tämä sivu on suojattu
                  </h1>
                  <p className="text-gray-600">
                    Syötä pääsykoodi nähdäksesi häiden tiedot
                  </p>
                </div>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <Input
                    type="text"
                    placeholder="Syötä pääsykoodi..."
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="text-center text-lg font-mono"
                    autoFocus
                  />
                  {passwordError && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-2 text-center"
                    >
                      {passwordError}
                    </motion.p>
                  )}
                </div>

                <Button
                  type="submit"
                  className={`w-full bg-gradient-to-r ${theme.primary} text-white`}
                  disabled={!passwordInput}
                >
                  Avaa sivu
                </Button>
              </form>

              <div className="text-center text-sm text-gray-500">
                <p>💡 Jos sinulla ei ole pääsykoodia,</p>
                <p>pyydä sitä kutsun lähettäjältä</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Main wedding site content
  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.secondary}`}>
      {/* Hero Section */}
      <section className={`relative min-h-screen flex items-center justify-center bg-gradient-to-br ${theme.primary} text-white`}>
        <div className="absolute inset-0 bg-black/20"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4 space-y-8"
        >
          {/* Theme decoration */}
          {weddingSite.theme === "forest" && (
            <div className="text-8xl mb-8">
              🌲 🌲 🌲
            </div>
          )}
          
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-6xl md:text-8xl font-light tracking-wide"
            >
              {couple.bride.firstName.toUpperCase()} & {couple.groom.firstName.toUpperCase()}
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center gap-3 text-xl md:text-2xl"
            >
              <Calendar className="h-6 w-6" />
              <span>7.11.2024</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-center gap-3 text-lg"
            >
              <MapPin className="h-5 w-5" />
              <span>Helsinki, Suomi</span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="pt-8"
          >
            <Heart className="h-12 w-12 mx-auto animate-pulse" />
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        {/* <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1.5 h-1.5 bg-white rounded-full"
            />
          </div>
        </motion.div> */}
      </section>

      {/* RSVP Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="shadow-2xl border-2">
              <CardContent className="p-8 md:p-12 space-y-6">
                <div className="text-center space-y-4">
                  <h2 className={`text-4xl font-light ${theme.text}`}>
                    Vahvista osallistumisesi
                  </h2>
                  <p className="text-gray-600 text-lg">
                    Ilmoita tulostako häihimme viimeistään 1.10.2024
                  </p>
                </div>

                {rsvpStatus === null ? (
                  <div className="grid md:grid-cols-2 gap-4 pt-6">
                    <Button
                      onClick={() => handleRsvp("tulossa")}
                      className={`h-24 text-xl bg-gradient-to-r ${theme.primary} text-white hover:scale-105 transition-transform`}
                    >
                      <CheckCircle className="h-8 w-8 mr-3" />
                      Tulen häihin
                    </Button>
                    <Button
                      onClick={() => handleRsvp("ei_tule")}
                      variant="outline"
                      className="h-24 text-xl border-2 hover:scale-105 transition-transform"
                    >
                      <XCircle className="h-8 w-8 mr-3" />
                      En voi osallistua
                    </Button>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`text-center p-8 rounded-lg ${
                      rsvpStatus === "tulossa" 
                        ? "bg-green-50 border-2 border-green-300" 
                        : "bg-gray-50 border-2 border-gray-300"
                    }`}
                  >
                    {rsvpStatus === "tulossa" ? (
                      <>
                        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                        <h3 className="text-2xl font-semibold text-green-800 mb-2">
                          Kiitos vastauksestasi!
                        </h3>
                        <p className="text-green-700">
                          Odotamme sinua innolla häihimme! 🎉
                        </p>
                      </>
                    ) : (
                      <>
                        <Heart className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                          Kiitos ilmoituksesta
                        </h3>
                        <p className="text-gray-700">
                          Olemme pahoillamme, että et pääse paikalle
                        </p>
                      </>
                    )}
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Program Section */}
      <section className={`py-20 px-4 bg-white`}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className={`text-4xl font-light ${theme.text} mb-4`}>
              Häiden ohjelma
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r ${theme.primary} mx-auto"></div>
          </motion.div>

          <div className="space-y-6">
            {[
              { time: "14:00", title: "Vihkiminen", location: "Tuomiokirkko" },
              { time: "15:30", title: "Vastaanotto", location: "Hotel Kämp" },
              { time: "17:00", title: "Illallinen", location: "Ravintola Savoy" },
              { time: "19:00", title: "Häävalssit", location: "Ravintola Savoy" },
              { time: "20:00", title: "Juhla jatkuu", location: "Ravintola Savoy" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                      <div className={`${theme.accent} text-white px-4 py-2 rounded-lg text-center min-w-[80px]`}>
                        <Clock className="h-5 w-5 mx-auto mb-1" />
                        <div className="font-semibold">{item.time}</div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-800 mb-1">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{item.location}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white text-center">
        <div className="space-y-4">
          <Heart className="h-8 w-8 mx-auto text-pink-400" />
          <p className="text-lg">
            {couple.bride.firstName} & {couple.groom.firstName}
          </p>
          <p className="text-gray-400">7.11.2024 • Helsinki</p>
          {weddingSite.passwordProtected && (
            <Badge variant="secondary" className="mt-4">
              <Lock className="h-3 w-3 mr-1" />
              Suojattu sivu
            </Badge>
          )}
        </div>
      </footer>
    </div>
  );
}
