"use client";

import { use, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Link as LinkIcon, Globe, Share2, Trash2, FileText, Settings, Users, CheckCircle, Eye, Heart, Send, Mail, Lock, Copy, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useWedding } from "@/contexts/wedding-context";

export default function HaasivuDetailPage({ params }) {
  const router = useRouter();
  const { id: siteId } = use(params);

  // Get wedding data from context
  const {
    vieraskortti,
    weddingSite,
    stats,
    sendInvitations: sendInvitationsContext,
    publishSite,
    unpublishSite,
    setPasswordProtection,
    generateAccessCode: generateCode
  } = useWedding();

  // State for selected guests
  const [selectedGuests, setSelectedGuests] = useState([]);
  
  // Local state for password form (sync with context on save)
  const [isPasswordProtected, setIsPasswordProtected] = useState(weddingSite.passwordProtected);
  const [accessCode, setAccessCode] = useState(weddingSite.accessCode);

  // Destructure statistics
  const {
    totalCards,
    invitedCards: invitedCount,
    viewedCards: viewedCount,
    acceptedCards: acceptedCount,
    declinedCards: declinedCount,
    pendingCards: pendingCount,
    totalGuests
  } = stats;

  // Toggle card selection (работаем с КАРТОЧКАМИ!)
  const toggleCard = (cardId) => {
    setSelectedGuests(prev => 
      prev.includes(cardId) 
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    );
  };

  // Select all cards
  const selectAll = () => {
    setSelectedGuests(vieraskortti.map(card => card.id));
  };

  // Deselect all cards
  const deselectAll = () => {
    setSelectedGuests([]);
  };

  // Send invitations - работаем с КАРТОЧКАМИ
  const sendInvitations = () => {
    const selectedCards = vieraskortti.filter(card => selectedGuests.includes(card.id));
    const cardTitles = selectedCards.map(card => {
      const guestNames = card.vieraat.map(v => `${v.firstName} ${v.lastName}`).join(", ");
      return `${card.title} (${guestNames})`;
    }).join("\n");
    
    const totalPeople = selectedCards.reduce((sum, card) => sum + card.vieraat.length, 0);
    
    // Send through context
    sendInvitationsContext(selectedGuests);
    
    alert(`Kutsut lähetetty! 📧\n\n${selectedGuests.length} korttia, ${totalPeople} henkilöä:\n\n${cardTitles}`);
    setSelectedGuests([]);
  };

  // Generate random access code (easy to remember format)
  const generateAccessCode = () => {
    const code = generateCode();
    setAccessCode(code);
  };

  // Copy code to clipboard
  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(accessCode);
    alert("Koodi kopioitu leikepöydälle! 📋");
  };

  // Handle publish button click
  const handlePublish = () => {
    // Save password protection settings
    setPasswordProtection(isPasswordProtected, accessCode);
    
    // Publish site
    publishSite();
    
    alert(`✅ Sivu julkaistu!\n\n${isPasswordProtected ? `🔒 Suojattu koodilla: ${accessCode}` : '🌐 Avoin kaikille'}`);
  };

  // Handle unpublish
  const handleUnpublish = () => {
    unpublishSite();
    alert("Sivun julkaisu poistettu");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-pink-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Takaisin
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                Hääsivu
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Top Actions */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{weddingSite.name}</h2>
                {weddingSite.published && (
                  <Badge variant="default" className="mt-1">
                    <Globe className="h-3 w-3 mr-1" />
                    Julkaistu
                  </Badge>
                )}
              </div>
              <Link href={`/haasivut/${siteId}/muokkaus`}>
                <Button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                  <Edit className="h-4 w-4 mr-2" />
                  Muokkaus
                </Button>
              </Link>
            </div>

            <Tabs defaultValue="yleista" className="w-full">
              <div className="w-full flex justify-center">
                <TabsList className="mb-6 w-fit px-4 gap-4">
                  <TabsTrigger value="yleista">
                    <FileText className="h-4 w-4" />
                    Yleistä
                  </TabsTrigger>
                  <TabsTrigger value="osoite">
                    <LinkIcon className="h-4 w-4" />
                    Osoite
                  </TabsTrigger>
                  <TabsTrigger value="julkaisu">
                    <Globe className="h-4 w-4" />
                    Julkaisu
                  </TabsTrigger>
                  <TabsTrigger value="lahetys">
                    <Share2 className="h-4 w-4" />
                    Lähetys
                  </TabsTrigger>
                </TabsList>
              </div>


              {/* TAB: Yleistä */}
              <TabsContent value="yleista" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Preview */}
                  <div className="lg:col-span-2">
                    <Card className="overflow-hidden">
                      <div className="bg-gray-100 p-4 border-b flex items-center gap-2">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-red-400"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                          <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>
                        <div className="flex-1 text-center text-sm text-gray-500">
                          @ Esikatsella
                        </div>
                      </div>

                      <div className="aspect-[4/3] bg-gradient-to-br from-green-100 to-green-50 relative">
                        <div className="absolute inset-0 flex items-center justify-center p-12">
                          <div className="text-center w-full">
                            <h2 className="text-4xl font-light text-gray-700 mb-4">ANNA & VILLE</h2>
                            <p className="text-gray-600 mb-6">7.11.2024</p>
                            <div className="inline-block bg-green-200 text-green-800 px-6 py-2 rounded">
                              Etusivu • Tarinamme • Häävieraat • Häämatkatoiveet • RSVP
                            </div>
                            <div className="mt-16">
                              <div className="text-6xl mb-4">🌲🌲🌲</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Stats */}
                  <div className="space-y-4">
                    <Card className="p-0">
                      <CardContent className="p-6 space-y-3">
                        <h3 className="font-semibold text-gray-700 mb-4">Tilastot</h3>
                        <div className="text-sm text-gray-600 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Tila:</span>
                            <span className="font-medium text-yellow-600">Ei julkaistu</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Muokattu viimeksi:</span>
                            <span className="font-medium">Tänään</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Kävijät:</span>
                            <span className="font-medium">0</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Invitation Statistics */}
                    <Card className="border-pink-200 p-0">
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                          <Mail className="h-5 w-5 text-pink-500" />
                          <h3 className="font-semibold text-gray-700">Kutsut</h3>
                        </div>
                        <div className="text-sm space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Send className="h-4 w-4 text-blue-500" />
                              <span className="text-gray-600">Lähetetty</span>
                            </div>
                            <span className="font-bold text-blue-600">{invitedCount}/{totalCards} korttia</span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span className="ml-6">Henkilöä yhteensä</span>
                            <span>{totalGuests}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Eye className="h-4 w-4 text-purple-500" />
                              <span className="text-gray-600">Avattu</span>
                            </div>
                            <span className="font-bold text-purple-600">{viewedCount}/{invitedCount}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Heart className="h-4 w-4 text-green-500" />
                              <span className="text-gray-600">Hyväksytty</span>
                            </div>
                            <span className="font-bold text-green-600">{acceptedCount}/{invitedCount}</span>
                          </div>
                          {declinedCount > 0 && (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-red-500">✕</span>
                                <span className="text-gray-600">Kieltäytynyt</span>
                              </div>
                              <span className="font-bold text-red-600">{declinedCount}</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between pt-2 border-t">
                            <span className="text-gray-600">Odottaa vastausta</span>
                            <span className="font-bold text-orange-600">{pendingCount}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-red-200">
                      <CardContent className="p-6">
                        <Button variant="destructive" className="w-full justify-start" size="sm">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Poista sivu
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* TAB: Osoite */}
              <TabsContent value="osoite" className="space-y-6">
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-4">Sivuston osoite</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Valitse omaperäinen osoite hääsivullesi. Voit käyttää esimerkiksi nimiänne tai häiden teemaa.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="url">Osoite</Label>
                      <div className="flex gap-2">
                        <div className="flex-1 flex items-center">
                          <span className="bg-gray-100 text-gray-600 px-4 py-2 rounded-l border border-r-0">
                            haasivut.fi/
                          </span>
                          <Input
                            id="url"
                            defaultValue="ikimetsa"
                            className="rounded-l-none"
                          />
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">
                        Käytä vain pieniä kirjaimia, numeroita ja viivaa. Ei välilyöntejä.
                      </p>
                    </div>

                    <div className="pt-4 flex gap-3">
                      <Button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                        Tallenna muutokset
                      </Button>
                      <Button variant="outline">Peruuta</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* TAB: Julkaisu */}
              <TabsContent value="julkaisu" className="space-y-6">
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">Julkaisun hallinta</h3>
                      <p className="text-sm text-gray-600">
                        Julkaise hääsivu, jotta vieraasi voivat nähdä sen.
                      </p>
                    </div>

                    {weddingSite.published ? (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="font-medium text-green-800">Sivu on julkaistu</h4>
                            <p className="text-sm text-green-700 mt-1">
                              Sivusi on näkyvissä vieraillesi osoitteessa:{" "}
                              <a 
                                href={`/${weddingSite.url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-mono font-semibold underline hover:text-green-900"
                              >
                                haasivut.fi/{weddingSite.url}
                              </a>
                            </p>
                            <p className="text-xs text-green-600 mt-2">
                              Julkaistu: {new Date(weddingSite.publishedAt).toLocaleString('fi-FI')}
                            </p>
                            <Link href={`/${weddingSite.url}`} target="_blank">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="mt-3 border-green-600 text-green-700 hover:bg-green-100"
                              >
                                <Globe className="h-4 w-4 mr-2" />
                                Avaa sivu uudessa välilehdessä
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Globe className="h-5 w-5 text-yellow-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-yellow-800">Sivu ei ole julkaistu</h4>
                            <p className="text-sm text-yellow-700 mt-1">
                              Tämä sivu ei ole vielä näkyvissä vieraillesi. Julkaise se alla olevalla painikkeella.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Password Protection */}
                    <div className="border-t pt-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Lock className="h-5 w-5 text-purple-600" />
                        <div>
                          <h3 className="font-semibold text-gray-700">Salasanasuojaus</h3>
                          <p className="text-sm text-gray-600">
                            Suojaa sivusi salasanalla tai koodilla
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="password-protection"
                            checked={isPasswordProtected}
                            onCheckedChange={setIsPasswordProtected}
                          />
                          <Label 
                            htmlFor="password-protection"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            Vaadi salasana/koodi sivun katseluun
                          </Label>
                        </div>

                        {isPasswordProtected && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ 
                              duration: 0.15, // Продолжительность в секундах (можно менять)
                              ease: "easeInOut" // Тип easing: "linear", "easeIn", "easeOut", "easeInOut"
                            }}
                            className="bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-4"
                          >
                            <div className="space-y-2">
                              <Label htmlFor="access-code">Pääsykoodi</Label>
                              <div className="flex gap-2">
                                <Input
                                  id="access-code"
                                  placeholder="Syötä koodi tai generoi uusi..."
                                  value={accessCode}
                                  onChange={(e) => setAccessCode(e.target.value)}
                                  className="flex-1"
                                />
                                <Button
                                  variant="outline"
                                  onClick={generateAccessCode}
                                  title="Generoi satunnainen koodi"
                                >
                                  <RefreshCw className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={copyCodeToClipboard}
                                  disabled={!accessCode}
                                  title="Kopioi koodi"
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                              <p className="text-xs text-gray-600">
                                💡 Klikkaa <RefreshCw className="h-3 w-3 inline" /> luodaksesi helposti muistettavan koodin (esim. "kulta42", "sydän17")
                              </p>
                            </div>

                            {accessCode && (
                              <div className="bg-white border border-purple-300 rounded p-3">
                                <p className="text-xs text-gray-600 mb-2">Vieraat näkevät:</p>
                                <div className="bg-gray-50 rounded p-3 text-center space-y-2">
                                  <Lock className="h-8 w-8 mx-auto text-purple-500" />
                                  <p className="font-medium text-gray-700">Tämä sivu on suojattu</p>
                                  <p className="text-sm text-gray-600">Syötä pääsykoodi:</p>
                                  <div className="bg-white border rounded px-3 py-2 text-center font-mono text-lg">
                                    ••••••
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* <div className="bg-yellow-50 border border-yellow-300 rounded p-3">
                              <p className="text-xs text-yellow-800">
                                ⚠️ <strong>Muista jakaa koodi vieraillesi!</strong> Lähetä koodi kutsujen mukana tai erillisellä viestillä.
                              </p>
                            </div> */}
                          </motion.div>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 flex gap-3 flex-wrap items-center">
                      {!weddingSite.published ? (
                        <Button 
                          onClick={handlePublish}
                          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                        >
                          <Globe className="h-4 w-4 mr-2" />
                          Julkaise sivu
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button 
                            onClick={handlePublish}
                            variant="outline"
                            className="border-green-500 text-green-600 hover:bg-green-50"
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Päivitä asetukset
                          </Button>
                          <Button 
                            onClick={handleUnpublish}
                            variant="outline"
                            className="border-red-500 text-red-600 hover:bg-red-50"
                          >
                            Poista julkaisu
                          </Button>
                        </div>
                      )}
                      {isPasswordProtected && accessCode && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Lock className="h-3 w-3" />
                          Suojattu: {accessCode}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* TAB: Lähetys */}
              <TabsContent value="lahetys" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Lähetä kutsut vieraille</CardTitle>
                    <p className="text-sm text-gray-600">
                      Valitse vieraat, joille haluat lähettää hääsivun linkin sähköpostitse.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Selection controls */}
                    <div className="flex items-center justify-between pb-4 border-b">
                      <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" onClick={selectAll}>
                          Valitse kaikki
                        </Button>
                        <Button variant="outline" size="sm" onClick={deselectAll}>
                          Poista valinnat
                        </Button>
                      </div>
                      <Badge variant="secondary" className="text-sm">
                        {selectedGuests.length} valittu
                      </Badge>
                    </div>

                    {/* Card list (VIERASKORTTI) */}
                    <div className="space-y-2 max-h-[500px] overflow-y-auto">
                      {vieraskortti.map((card) => (
                        <div
                          key={card.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-4 flex-1">
                            <Checkbox
                              checked={selectedGuests.includes(card.id)}
                              onCheckedChange={() => toggleCard(card.id)}
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-base">
                                  {card.title}
                                </span>
                                <Badge variant="secondary" className="text-xs">
                                  {card.category}
                                </Badge>
                                {card.invitationSent && (
                                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                    <Send className="h-3 w-3 mr-1" />
                                    Lähetetty
                                  </Badge>
                                )}
                              </div>
                              {/* Guests in this card */}
                              <div className="text-sm text-gray-600 mb-1">
                                {card.vieraat.map((v, i) => (
                                  <span key={i}>
                                    {v.firstName} {v.lastName}
                                    {i < card.vieraat.length - 1 && ", "}
                                  </span>
                                ))}
                              </div>
                              <div className="text-xs text-gray-500">{card.email}</div>
                            </div>
                          </div>

                          {/* Status indicators */}
                          <div className="flex items-center gap-2">
                            {card.invitationViewed && (
                              <div className="flex items-center gap-1 text-purple-600" title="Avattu">
                                <Eye className="h-4 w-4" />
                              </div>
                            )}
                            {card.rsvpStatus === "accepted" && (
                              <div className="flex items-center gap-1 text-green-600" title="Hyväksytty">
                                <Heart className="h-4 w-4" />
                              </div>
                            )}
                            {card.rsvpStatus === "declined" && (
                              <div className="flex items-center gap-1 text-red-600" title="Kieltäytynyt">
                                <span className="text-lg">✕</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Send button */}
                    <div className="pt-4 border-t">
                      <Button
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                        size="lg"
                        onClick={sendInvitations}
                        disabled={selectedGuests.length === 0}
                      >
                        <Send className="h-5 w-5 mr-2" />
                        Lähetä kutsut ({selectedGuests.length})
                      </Button>
                      {selectedGuests.length === 0 && (
                        <p className="text-sm text-gray-500 text-center mt-2">
                          Valitse vähintään yksi vieras
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
