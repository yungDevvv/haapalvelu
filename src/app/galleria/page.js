"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Heart, Lock, Camera, AlertCircle, Eye, Download, ChevronLeft, ChevronRight, X, Upload, Trash2, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { photoGalleries } from "@/lib/mock-data";

export default function GalleriaPage() {
  const searchParams = useSearchParams();
  const galleryId = searchParams.get('id');
  
  const [gallery, setGallery] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  
  // Guest upload states
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploaderName, setUploaderName] = useState("");
  const [uploaderEmail, setUploaderEmail] = useState("");

  useEffect(() => {
    if (!galleryId) {
      return;
    }

    // Find gallery by ID
    const foundGallery = photoGalleries.find(g => g.id === parseInt(galleryId));
    
    if (!foundGallery) {
      return;
    }

    setGallery(foundGallery);

    // Check if password protected
    if (foundGallery.isPasswordProtected) {
      // Check if already unlocked in session
      const unlocked = sessionStorage.getItem(`gallery_${foundGallery.id}_unlocked`);
      if (!unlocked) {
        setIsLocked(true);
      }
    }

    // Apply copy protection if enabled
    if (foundGallery.disableCopyProtection) {
      // Prevent right click
      const preventContextMenu = (e) => {
        e.preventDefault();
        return false;
      };

      // Prevent drag and drop
      const preventDragStart = (e) => {
        e.preventDefault();
        return false;
      };

      document.addEventListener('contextmenu', preventContextMenu);
      document.addEventListener('dragstart', preventDragStart);

      // Cleanup
      return () => {
        document.removeEventListener('contextmenu', preventContextMenu);
        document.removeEventListener('dragstart', preventDragStart);
      };
    }
  }, [galleryId]);

  const handlePasswordSubmit = () => {
    if (!gallery) return;

    if (passwordInput === gallery.password) {
      sessionStorage.setItem(`gallery_${gallery.id}_unlocked`, 'true');
      setIsLocked(false);
      setPasswordError("");
      setPasswordInput("");
    } else {
      setPasswordError("Väärä salasana");
    }
  };

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const fileObjects = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9)
    }));
    setSelectedFiles(prev => [...prev, ...fileObjects]);
  };

  const removeFile = (fileId) => {
    setSelectedFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  const handleUploadSubmit = () => {
    // In real app: upload files to server
    alert(`Kiitos ${uploaderName}! ${selectedFiles.length} kuvaa lähetetty.`);
    
    // Reset form
    selectedFiles.forEach(f => URL.revokeObjectURL(f.preview));
    setSelectedFiles([]);
    setUploaderName("");
    setUploaderEmail("");
    setIsUploadDialogOpen(false);
  };

  // No gallery ID provided
  if (!galleryId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-pink-500" />
            </div>
            <CardTitle>Linkki puuttuu</CardTitle>
            <CardDescription>
              Tarvitset suoran linkin galleriaan. Pyydä hääpariltä oikea linkki.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Gallery not found
  if (!gallery) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <CardTitle>Galleriaa ei löydy</CardTitle>
            <CardDescription>
              Galleria on poistettu tai linkki on virheellinen.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Password required
  if (isLocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-8 w-8 text-amber-600" />
            </div>
            <CardTitle>{gallery.title}</CardTitle>
            <CardDescription>
              Tämä galleria on suojattu salasanalla
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Salasana</Label>
              <Input
                id="password"
                type="password"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setPasswordError("");
                }}
                onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                placeholder="Syötä salasana"
                className={passwordError ? "border-red-500" : ""}
              />
              {passwordError && (
                <p className="text-sm text-red-500">{passwordError}</p>
              )}
            </div>
            <Button 
              onClick={handlePasswordSubmit} 
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            >
              Avaa galleria
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Gallery view
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Simple header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Heart className="h-8 w-8 text-pink-500" />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                {gallery.title}
              </h1>
              <p className="text-sm text-gray-600">
                {gallery.photos.length} kuvaa
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Gallery content */}
      <main className="container mx-auto px-4 py-8">
        {/* Description & Guest Upload Section */}
        {(gallery.description || gallery.allowGuestUploads) && (
          <div className="mb-6">
            {gallery.description && (
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-lg p-4 mb-4">
                <p className="text-gray-700 text-center">{gallery.description}</p>
              </div>
            )}
            
            {gallery.allowGuestUploads && (
              <div className="flex flex-col items-center gap-2">
                <Button
                  onClick={() => setIsUploadDialogOpen(true)}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                  size="lg"
                >
                  <Upload className="h-5 w-5 mr-2" />
                  Lähetä kuvia
                </Button>
                <p className="text-sm text-muted-foreground text-center">
                  Voit lähettää useita kuvia kerralla
                </p>
              </div>
            )}
          </div>
        )}

        {/* Photos grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {gallery.photos.map((photo, index) => (
            <div
              key={photo.id}
              className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-all duration-200 group relative"
              onClick={() => openLightbox(index)}
            >
              <img
                src={photo.url}
                alt={photo.caption || "Kuva"}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                draggable={!gallery.disableCopyProtection}
                style={gallery.disableCopyProtection ? {
                  userSelect: 'none',
                  pointerEvents: 'auto',
                  WebkitTouchCallout: 'none',
                  WebkitUserSelect: 'none'
                } : {}}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                  <Eye className="h-4 w-4 text-gray-700" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {gallery.photos.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Camera className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Ei kuvia vielä
              </h3>
              <p className="text-gray-500">
                Kuvia lisätään pian
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Lightbox */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-6xl h-[85vh] p-0 gap-0">
          <DialogTitle className="sr-only">Kuvan katselu</DialogTitle>
          {gallery.photos.length > 0 && gallery.photos[lightboxIndex] && (
            <div className="relative h-full flex flex-col">
              {/* Close button */}
              <div className="absolute top-4 right-4 z-20">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsLightboxOpen(false)}
                  className="bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm rounded-full h-10 w-10"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Main image area */}
              <div className="flex-1 flex items-center justify-center bg-black/95 relative overflow-hidden">
                <img
                  src={gallery.photos[lightboxIndex].url}
                  alt={gallery.photos[lightboxIndex].caption || "Kuva"}
                  className="max-h-full max-w-full object-contain"
                  draggable={!gallery.disableCopyProtection}
                  style={gallery.disableCopyProtection ? {
                    userSelect: 'none',
                    pointerEvents: 'auto',
                    WebkitTouchCallout: 'none',
                    WebkitUserSelect: 'none'
                  } : {}}
                />

                {/* Navigation buttons */}
                {lightboxIndex > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm rounded-full h-12 w-12"
                    onClick={() => setLightboxIndex(lightboxIndex - 1)}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                )}
                {lightboxIndex < gallery.photos.length - 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm rounded-full h-12 w-12"
                    onClick={() => setLightboxIndex(lightboxIndex + 1)}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                )}

                {/* Image counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                  {lightboxIndex + 1} / {gallery.photos.length}
                </div>
              </div>

              {/* Photo info footer */}
              <div className="p-6 bg-white border-t">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1 space-y-2">
                    <h3 className="text-lg font-semibold">
                      {gallery.photos[lightboxIndex].caption || "Ei kuvausta"}
                    </h3>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      {gallery.photos[lightboxIndex].uploadedBy && (
                        <div className="flex items-center gap-1.5">
                          <span>📸</span>
                          {gallery.photos[lightboxIndex].uploadedBy}
                        </div>
                      )}
                      {gallery.photos[lightboxIndex].uploadDate && (
                        <div className="flex items-center gap-1.5">
                          <span>📅</span>
                          {new Date(gallery.photos[lightboxIndex].uploadDate).toLocaleDateString('fi-FI')}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {!gallery.disableCopyProtection && (
                    <div className="flex gap-2 flex-shrink-0">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download className="h-4 w-4" />
                        Lataa
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Guest Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-pink-500" />
              Lähetä kuvia
            </DialogTitle>
            <DialogDescription>
              Valitse kuvat ja lisää tietosi. Voit lähettää useita kuvia kerralla.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* File Input */}
            <div className="space-y-2">
              <Label htmlFor="file-upload" className="text-sm font-medium">
                Valitse kuvat *
              </Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-pink-500 transition-colors">
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-700">
                    Klikkaa valitaksesi kuvia
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    tai vedä ja pudota tähän
                  </p>
                </label>
              </div>
            </div>

            {/* Preview Grid */}
            {selectedFiles.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">
                    Valitut kuvat ({selectedFiles.length})
                  </Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      selectedFiles.forEach(f => URL.revokeObjectURL(f.preview));
                      setSelectedFiles([]);
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Poista kaikki
                  </Button>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3 max-h-[300px] overflow-y-auto p-2 border rounded-lg">
                  {selectedFiles.map((fileObj) => (
                    <div key={fileObj.id} className="relative group">
                      <img
                        src={fileObj.preview}
                        alt="Preview"
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeFile(fileObj.id)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* User Info */}
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="uploader-name">Nimesi *</Label>
                <Input
                  id="uploader-name"
                  value={uploaderName}
                  onChange={(e) => setUploaderName(e.target.value)}
                  placeholder="Esim. Mikko Virtanen"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="uploader-email">Sähköposti (valinnainen)</Label>
                <Input
                  id="uploader-email"
                  type="email"
                  value={uploaderEmail}
                  onChange={(e) => setUploaderEmail(e.target.value)}
                  placeholder="mikko@email.com"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
              Peruuta
            </Button>
            <Button
              onClick={handleUploadSubmit}
              disabled={selectedFiles.length === 0 || !uploaderName.trim()}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            >
              <Upload className="h-4 w-4 mr-2" />
              Lähetä {selectedFiles.length > 0 && `(${selectedFiles.length})`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
