"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, MoreVertical, Trash2, Camera, Upload, Download, Heart, Search, Grid3X3, List, Star, Clock, User, ImageIcon, Maximize2, X, ChevronLeft, ChevronRight, Share2, Eye, Lock, Smartphone, Bell, CheckSquare, Edit, ArrowUpDown, Shield, Languages, Save, Copy, CheckCircle2 } from "lucide-react";

export function PhotoGallery({ galleries: initialGalleries }) {
  const [galleries, setGalleries] = useState(initialGalleries);
  const [isAddGalleryOpen, setIsAddGalleryOpen] = useState(false);
  const [isAddPhotoOpen, setIsAddPhotoOpen] = useState(false);
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [viewingPhoto, setViewingPhoto] = useState(null);
  const [filterCategory, setFilterCategory] = useState("kaikki");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Form states
  const [galleryForm, setGalleryForm] = useState({
    title: "",
    description: "",
    password: "",
    isPasswordProtected: false,
    allowGuestUploads: true,
    disableCopyProtection: false
  });

  const [photoForm, setPhotoForm] = useState({
    caption: "",
    captionEn: "",
    uploadedBy: "",
    galleryId: null
  });

  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [isGuestUploadOpen, setIsGuestUploadOpen] = useState(false);
  const [guestNotifications, setGuestNotifications] = useState([]);

  const [guestUploadForm, setGuestUploadForm] = useState({
    uploaderName: "",
    uploaderEmail: "",
    caption: "",
    selectedGalleryId: null
  });

  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [sharingGallery, setSharingGallery] = useState(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [passwordCopied, setPasswordCopied] = useState(false);
  const [isEditGalleryOpen, setIsEditGalleryOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState(null);

  const categories = [
    { value: "kaikki", label: "Kaikki kuvat", icon: ImageIcon },
    { value: "polttarit", label: "Polttarit", color: "bg-purple-100 text-purple-800", icon: Star },
    { value: "haakuvat", label: "Hääkuvat", color: "bg-pink-100 text-pink-800", icon: Heart },
    { value: "hamatka", label: "Häämatkakuvat", color: "bg-blue-100 text-blue-800", icon: Camera },
    { value: "valmistelut", label: "Valmistelut", color: "bg-green-100 text-green-800", icon: Clock },
    { value: "juhlat", label: "Juhlat", color: "bg-orange-100 text-orange-800", icon: User }
  ];

  const resetGalleryForm = () => {
    setGalleryForm({
      title: "",
      description: "",
      password: "",
      isPasswordProtected: false,
      allowGuestUploads: true,
      disableCopyProtection: false
    });
  };

  const resetPhotoForm = () => {
    setPhotoForm({ caption: "", uploadedBy: "", galleryId: null });
  };

  const handleAddGallery = () => {
    const newGallery = {
      id: Math.max(...galleries.map(g => g.id)) + 1,
      ...galleryForm,
      photos: []
    };
    setGalleries([...galleries, newGallery]);
    setIsAddGalleryOpen(false);
    resetGalleryForm();
  };

  const handleAddPhoto = () => {
    const newPhoto = {
      id: Math.max(...galleries.flatMap(g => g.photos.map(p => p.id))) + 1,
      url: "/photos/placeholder.jpg",
      caption: photoForm.caption,
      uploadedBy: photoForm.uploadedBy,
      uploadDate: new Date().toISOString().split('T')[0],
      likes: 0,
      views: 0
    };

    setGalleries(galleries.map(g =>
      g.id === photoForm.galleryId
        ? { ...g, photos: [...g.photos, newPhoto] }
        : g
    ));
    setIsAddPhotoOpen(false);
    resetPhotoForm();
  };

  const handleDeleteGallery = (galleryId) => {
    setGalleries(galleries.filter(g => g.id !== galleryId));
  };

  const handleEditGallery = () => {
    setGalleries(galleries.map(g =>
      g.id === editingGallery.id
        ? { ...g, ...galleryForm }
        : g
    ));
    setIsEditGalleryOpen(false);
    setEditingGallery(null);
    resetGalleryForm();
  };

  const getCategoryInfo = (category) => {
    return categories.find(c => c.value === category) || categories[0];
  };

  // Advanced filtering and sorting
  const filteredGalleries = galleries.filter(gallery => {
    const categoryMatch = filterCategory === "kaikki" || gallery.category === filterCategory;
    const searchMatch = searchQuery === "" ||
      gallery.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gallery.photos.some(photo =>
        photo.caption?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        photo.uploadedBy?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return categoryMatch && searchMatch;
  }).sort((a, b) => {
    switch (sortBy) {
      case "oldest":
        return new Date(a.date) - new Date(b.date);
      case "name":
        return a.title.localeCompare(b.title);
      case "newest":
      default:
        return new Date(b.date) - new Date(a.date);
    }
  });

  const totalPhotos = galleries.reduce((sum, gallery) => sum + gallery.photos.length, 0);
  const allPhotos = galleries.flatMap(gallery =>
    gallery.photos.map(photo => ({ ...photo, galleryTitle: gallery.title, galleryCategory: gallery.category }))
  );

  const openLightbox = (photos, index) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Kuvagalleria
            </h2>
            <p className="text-muted-foreground mt-1">
              {totalPhotos} kuvaa • {filteredGalleries.length} galleriaa
            </p>
          </div>

          <div className="flex gap-2">
            {/* Guest Upload Button */}
            <Dialog open={isGuestUploadOpen} onOpenChange={setIsGuestUploadOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Smartphone className="h-4 w-4" />
                  Lähetä kuvia
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5 text-pink-500" />
                    Lähetä kuva hääparille
                  </DialogTitle>
                  <DialogDescription>
                    Jaa hääjuhlan kuvat helposti suoraan puhelimesta, tabletista tai tietokoneesta
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                      ✨ Ei tarvitse ladata lisäohjelmia! Kuvat tallentuvat suoraan hääparille.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guest-gallery">Valitse galleria *</Label>
                    <Select
                      value={guestUploadForm.selectedGalleryId?.toString()}
                      onValueChange={(value) => setGuestUploadForm({ ...guestUploadForm, selectedGalleryId: parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Valitse galleria" />
                      </SelectTrigger>
                      <SelectContent>
                        {galleries.map((gallery) => (
                          <SelectItem key={gallery.id} value={gallery.id.toString()}>
                            {gallery.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guest-name">Nimesi *</Label>
                    <Input
                      id="guest-name"
                      value={guestUploadForm.uploaderName}
                      onChange={(e) => setGuestUploadForm({ ...guestUploadForm, uploaderName: e.target.value })}
                      placeholder="Etunimi Sukunimi"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guest-email">Sähköposti (valinnainen)</Label>
                    <Input
                      id="guest-email"
                      type="email"
                      value={guestUploadForm.uploaderEmail}
                      onChange={(e) => setGuestUploadForm({ ...guestUploadForm, uploaderEmail: e.target.value })}
                      placeholder="nimi@email.fi"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guest-caption">Kuvateksti (valinnainen)</Label>
                    <Textarea
                      id="guest-caption"
                      value={guestUploadForm.caption}
                      onChange={(e) => setGuestUploadForm({ ...guestUploadForm, caption: e.target.value })}
                      placeholder="Kerro jotain kuvasta..."
                      rows={2}
                    />
                  </div>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-pink-300 transition-colors cursor-pointer bg-gradient-to-br from-gray-50 to-gray-100">
                    <Upload className="h-12 w-12 mx-auto text-pink-500 mb-2" />
                    <p className="text-sm font-medium mb-1">Valitse kuvat laitteeltasi</p>
                    <p className="text-xs text-muted-foreground">Toimii kännykällä, tabletilla ja tietokoneella</p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsGuestUploadOpen(false)}>
                    Peruuta
                  </Button>
                  <Button
                    onClick={() => {
                      // Mock function - in real app would handle upload
                      alert(`${guestUploadForm.uploaderName} lähetti kuvan!`);
                      setIsGuestUploadOpen(false);
                    }}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Lähetä kuvat
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isAddGalleryOpen} onOpenChange={setIsAddGalleryOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Uusi galleria
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Luo uusi galleria</DialogTitle>
                  <DialogDescription>
                    Luo uusi kuvagalleria tapahtumallesi.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
                  <div className="space-y-2">
                    <Label htmlFor="gallery-title">Gallerian nimi *</Label>
                    <Input
                      id="gallery-title"
                      value={galleryForm.title}
                      onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                      placeholder="Esim. Hääkuvat 2024"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gallery-description">Esittelyteksti</Label>
                    <Textarea
                      id="gallery-description"
                      value={galleryForm.description}
                      onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })}
                      placeholder="Kuvagalleriamme kauneimmat hetket..."
                      rows={2}
                    />
                    <p className="text-xs text-muted-foreground">Näytetään gallerian yläosassa</p>
                  </div>

                  {/* Security Section */}
                  <div className="border-t pt-4 space-y-4">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Shield className="h-4 w-4 text-blue-600" />
                      Turvallisuusasetukset
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                      <p className="text-sm text-blue-800">
                        💡 Kaikki galleriat jaetaan linkillä. Lisää salasana jos haluat suojata sisällön.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Lock className="h-4 w-4 text-amber-600" />
                          <div>
                            <Label className="text-sm font-medium">Salasanasuojaus</Label>
                            <p className="text-xs text-muted-foreground">Vaadi salasana gallerian avaamiseen</p>
                          </div>
                        </div>
                        <Checkbox
                          checked={galleryForm.isPasswordProtected}
                          onCheckedChange={(checked) => setGalleryForm({ ...galleryForm, isPasswordProtected: checked })}
                        />
                      </div>

                      {galleryForm.isPasswordProtected && (
                        <div className="space-y-2 ml-6">
                          <Label htmlFor="gallery-password">Salasana *</Label>
                          <Input
                            id="gallery-password"
                            type="password"
                            value={galleryForm.password}
                            onChange={(e) => setGalleryForm({ ...galleryForm, password: e.target.value })}
                            placeholder="Syötä salasana"
                          />
                          <p className="text-xs text-muted-foreground">
                            Vieras tarvitsee tämän salasanan katsoakseen gallerian
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Copy className="h-4 w-4 text-gray-600" />
                          <div>
                            <Label className="text-sm font-medium">Kopioinnin esto</Label>
                            <p className="text-xs text-muted-foreground">Estä kuvien lataaminen hiiren oikealla</p>
                          </div>
                        </div>
                        <Checkbox
                          checked={galleryForm.disableCopyProtection}
                          onCheckedChange={(checked) => setGalleryForm({ ...galleryForm, disableCopyProtection: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-green-600" />
                          <div>
                            <Label className="text-sm font-medium">Vieraiden lähetys</Label>
                            <p className="text-xs text-muted-foreground">Vieraat voivat lähettää kuvia galleriaan</p>
                          </div>
                        </div>
                        <Checkbox
                          checked={galleryForm.allowGuestUploads}
                          onCheckedChange={(checked) => setGalleryForm({ ...galleryForm, allowGuestUploads: checked })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddGalleryOpen(false)}>
                    Peruuta
                  </Button>
                  <Button onClick={handleAddGallery}>
                    Luo galleria
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Edit Gallery Dialog */}
            <Dialog open={isEditGalleryOpen} onOpenChange={setIsEditGalleryOpen}>
              <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Edit className="h-5 w-5 text-pink-500" />
                    Muokkaa galleriaa
                  </DialogTitle>
                  <DialogDescription>
                    Muuta gallerian tietoja ja turvallisuusasetuksia
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-title">Gallerian nimi *</Label>
                      <Input
                        id="edit-title"
                        value={galleryForm.title}
                        onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                        placeholder="esim. Hääkuvat 2024"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-description">Kuvaus</Label>
                      <Textarea
                        id="edit-description"
                        value={galleryForm.description}
                        onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })}
                        placeholder="Kerro galleriasta lyhyesti..."
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Security Section */}
                  <div className=" space-y-4">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Shield className="h-4 w-4 text-blue-600" />
                      Turvallisuusasetukset
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Lock className="h-4 w-4 text-amber-600" />
                          <div>
                            <Label className="text-sm font-medium">Salasanasuojaus</Label>
                            <p className="text-xs text-muted-foreground">Vaadi salasana gallerian avaamiseen</p>
                          </div>
                        </div>
                        <Checkbox
                          checked={galleryForm.isPasswordProtected}
                          onCheckedChange={(checked) => setGalleryForm({ ...galleryForm, isPasswordProtected: checked })}
                        />
                      </div>

                      {galleryForm.isPasswordProtected && (
                        <div className="space-y-2 ml-6">
                          <Label htmlFor="edit-password">Salasana *</Label>
                          <Input
                            id="edit-password"
                            type="password"
                            value={galleryForm.password}
                            onChange={(e) => setGalleryForm({ ...galleryForm, password: e.target.value })}
                            placeholder="Syötä salasana"
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Copy className="h-4 w-4 text-gray-600" />
                          <div>
                            <Label className="text-sm font-medium">Kopioinnin esto</Label>
                            <p className="text-xs text-muted-foreground">Estä kuvien lataaminen hiiren oikealla</p>
                          </div>
                        </div>
                        <Checkbox
                          checked={galleryForm.disableCopyProtection}
                          onCheckedChange={(checked) => setGalleryForm({ ...galleryForm, disableCopyProtection: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-green-600" />
                          <div>
                            <Label className="text-sm font-medium">Vieraiden lähetys</Label>
                            <p className="text-xs text-muted-foreground">Vieraat voivat lähettää kuvia galleriaan</p>
                          </div>
                        </div>
                        <Checkbox
                          checked={galleryForm.allowGuestUploads}
                          onCheckedChange={(checked) => setGalleryForm({ ...galleryForm, allowGuestUploads: checked })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => {
                    setIsEditGalleryOpen(false);
                    setEditingGallery(null);
                    resetGalleryForm();
                  }}>
                    Peruuta
                  </Button>
                  <Button onClick={handleEditGallery} className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
                    Tallenna muutokset
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Hae kuvia tai gallerioita..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white"
              />
            </div>

            {/* Category Filter */}
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="Kategoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <SelectItem key={category.value} value={category.value}>
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4" />
                        {category.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px] bg-white">
                <SelectValue placeholder="Järjestys" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Uusimmat</SelectItem>
                <SelectItem value="oldest">Vanhimmat</SelectItem>
                <SelectItem value="name">Nimi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-lg border shadow-sm">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-8 px-3"
              title="Ruudukkonäkymä"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "masonry" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("masonry")}
              className="h-8 px-3"
              title="Listanäkymä"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredGalleries.length === 0 && (
        <div className="text-center py-12">
          <Camera className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? "Ei hakutuloksia" : "Ei gallerioita vielä"}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchQuery ? "Kokeile eri hakusanoja" : "Luo ensimmäinen galleriasi aloittaaksesi"}
          </p>
          {!searchQuery && (
            <Button onClick={() => setIsAddGalleryOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Luo galleria
            </Button>
          )}
        </div>
      )}

      {/* Galleries Grid */}
      <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 md:grid-cols-2"}`}>
        {filteredGalleries.map((gallery) => {
          return (
            <Card key={gallery.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg font-semibold">{gallery.title}</CardTitle>
                        {gallery.isPasswordProtected && (
                          <Lock className="h-4 w-4 text-amber-600" title="Salasanasuojattu" />
                        )}
                        {gallery.disableCopyProtection && (
                          <Shield className="h-4 w-4 text-blue-600" title="Kopiointi estetty" />
                        )}
                        {gallery.allowGuestUploads && (
                          <User className="h-4 w-4 text-green-600" title="Vieraiden lähetys" />
                        )}
                      </div>
                      <CardDescription className="text-sm">
                        {gallery.photos.length} kuvaa
                      </CardDescription>
                      {gallery.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {gallery.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="self-start">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => {
                        setEditingGallery(gallery);
                        setGalleryForm({
                          title: gallery.title,
                          description: gallery.description || "",
                          password: gallery.password || "",
                          isPasswordProtected: gallery.isPasswordProtected || false,
                          allowGuestUploads: gallery.allowGuestUploads !== false,
                          disableCopyProtection: gallery.disableCopyProtection || false
                        });
                        setIsEditGalleryOpen(true);
                      }}>
                        <Edit className="h-4 w-4 mr-2" />
                        Muokkaa galleriaa
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        setSelectedGallery(gallery);
                        setPhotoForm({ ...photoForm, galleryId: gallery.id });
                        setIsAddPhotoOpen(true);
                      }}>
                        <Upload className="h-4 w-4 mr-2" />
                        Lisää kuvia
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        const url = `${window.location.origin}/galleria?id=${gallery.id}`;
                        setShareUrl(url);
                        setSharingGallery(gallery);
                        setShareDialogOpen(true);
                      }}>
                        <Share2 className="h-4 w-4 mr-2" />
                        Jaa galleria
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteGallery(gallery.id)} className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Poista galleria
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {gallery.photos.length > 0 ? (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      {gallery.photos.slice(0, 4).map((photo, index) => (
                        <div
                          key={photo.id}
                          className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-all duration-200 group/photo relative"
                          onClick={() => openLightbox(gallery.photos, index)}
                        >
                          <img
                            src={photo.url}
                            alt={photo.caption || "Kuva"}
                            className="w-full h-full object-cover group-hover/photo:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 hidden items-center justify-center">
                            <Camera className="h-8 w-8 text-gray-400" />
                          </div>
                          <div className="absolute inset-0 bg-black/0 group-hover/photo:bg-black/20 transition-colors" />
                          <div className="absolute top-2 right-2 opacity-0 group-hover/photo:opacity-100 transition-opacity">
                            <Maximize2 className="h-5 w-5 text-white drop-shadow-lg" />
                          </div>
                        </div>
                      ))}
                    </div>
                    {gallery.photos.length > 4 && (
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                          +{gallery.photos.length - 4} lisää kuvaa
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200">
                    <Camera className="h-12 w-12 mb-2" />
                    <p className="text-sm font-medium">Ei kuvia vielä</p>
                    <p className="text-xs">Lisää ensimmäinen kuva</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 hover:bg-pink-50 hover:border-pink-200"
                    onClick={() => {
                      setSelectedGallery(gallery);
                      setPhotoForm({ ...photoForm, galleryId: gallery.id });
                      setIsAddPhotoOpen(true);
                    }}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Lisää kuvia
                  </Button>
                  {gallery.photos.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openLightbox(gallery.photos, 0)}
                      className="hover:bg-blue-50 hover:border-blue-200"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add Photo Dialog */}
      <Dialog open={isAddPhotoOpen} onOpenChange={setIsAddPhotoOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Lisää kuvia galleriaan</DialogTitle>
            <DialogDescription>
              Lisää uusia kuvia galleriaan "{selectedGallery?.title}".
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Valitse kuvat</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-pink-300 transition-colors">
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 mb-2">Raahaa kuvia tähän tai klikkaa valitaksesi</p>
                <Button variant="outline" size="sm" className="hover:bg-pink-50">
                  <Plus className="h-4 w-4 mr-2" />
                  Valitse tiedostot
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="photo-caption">Kuvateksti</Label>
              <Textarea
                id="photo-caption"
                value={photoForm.caption}
                onChange={(e) => setPhotoForm({ ...photoForm, caption: e.target.value })}
                placeholder="Kuvaile kuvaa..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="photo-uploader">Lataaja</Label>
              <Input
                id="photo-uploader"
                value={photoForm.uploadedBy}
                onChange={(e) => setPhotoForm({ ...photoForm, uploadedBy: e.target.value })}
                placeholder="Kuka latasi kuvan?"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddPhotoOpen(false)}>
              Peruuta
            </Button>
            <Button onClick={handleAddPhoto} className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
              <Upload className="h-4 w-4 mr-2" />
              Lisää kuvat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lightbox */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-6xl h-[85vh] p-0 gap-0">
          <DialogTitle className="sr-only">Kuvan katselu</DialogTitle>
          {allPhotos.length > 0 && allPhotos[lightboxIndex] && (
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
                  src={allPhotos[lightboxIndex].url.startsWith('/photos/')
                    ? `https://placehold.co/1200x800/pink/white?text=${encodeURIComponent(allPhotos[lightboxIndex].caption || 'Kuva')}`
                    : allPhotos[lightboxIndex].url}
                  alt={allPhotos[lightboxIndex].caption || "Kuva"}
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    e.target.src = `https://placehold.co/1200x800/e5e7eb/6b7280?text=${encodeURIComponent(allPhotos[lightboxIndex].caption || 'Kuva')}`;
                  }}
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
                {lightboxIndex < allPhotos.length - 1 && (
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
                  {lightboxIndex + 1} / {allPhotos.length}
                </div>
              </div>

              {/* Photo info footer */}
              <div className="p-6 bg-white border-t">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold">
                        {allPhotos[lightboxIndex].caption || "Ei kuvausta"}
                      </h3>
                      {allPhotos[lightboxIndex].galleryCategory && (
                        <Badge className={getCategoryInfo(allPhotos[lightboxIndex].galleryCategory).color}>
                          {getCategoryInfo(allPhotos[lightboxIndex].galleryCategory).label}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      {allPhotos[lightboxIndex].uploadedBy && (
                        <div className="flex items-center gap-1.5">
                          <User className="h-4 w-4" />
                          {allPhotos[lightboxIndex].uploadedBy}
                        </div>
                      )}
                      {allPhotos[lightboxIndex].uploadDate && (
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          {new Date(allPhotos[lightboxIndex].uploadDate).toLocaleDateString('fi-FI')}
                        </div>
                      )}
                      {allPhotos[lightboxIndex].galleryTitle && (
                        <div className="flex items-center gap-1.5">
                          <ImageIcon className="h-4 w-4" />
                          {allPhotos[lightboxIndex].galleryTitle}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground pt-1">
                      <div className="flex items-center gap-1.5">
                        <Eye className="h-4 w-4" />
                        {allPhotos[lightboxIndex].views || 0} katselukertaa
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="h-4 w-4" />
                      Lataa
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Share Gallery Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={(open) => {
        setShareDialogOpen(open);
        if (!open) {
          // Reset states when dialog closes
          setLinkCopied(false);
          setPasswordCopied(false);
        }
      }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-pink-500" />
              Jaa galleria
            </DialogTitle>
            <DialogDescription>
              Kopioi linkki ja jaa se vieraille
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* URL Display */}
            <div className="space-y-2">
              <Label>Gallerian linkki</Label>
              <div className="flex gap-2">
                <Input
                  value={shareUrl}
                  readOnly
                  className="font-mono text-sm"
                  onClick={(e) => e.target.select()}
                />
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(shareUrl);
                    setLinkCopied(true);
                    setTimeout(() => setLinkCopied(false), 2000);
                  }}
                  className={linkCopied
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                  }
                >
                  {linkCopied ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Kopioitu!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Kopioi
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Password Info */}
            {sharingGallery?.isPasswordProtected && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-amber-600" />
                  <span className="font-medium text-sm text-amber-900">Salasanasuojattu galleria</span>
                </div>
                <p className="text-sm text-amber-800">
                  Muista jakaa myös salasana vieraille:
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Input
                    value={sharingGallery.password}
                    readOnly
                    className="font-mono font-bold bg-white"
                    onClick={(e) => e.target.select()}
                  />
                  <Button
                    variant={passwordCopied ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(sharingGallery.password);
                      setPasswordCopied(true);
                      setTimeout(() => setPasswordCopied(false), 2000);
                    }}
                    className={passwordCopied ? "bg-green-500 hover:bg-green-600" : ""}
                  >
                    {passwordCopied ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Success Info */}
            {!sharingGallery?.isPasswordProtected && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-800">
                  Tämä galleria ei vaadi salasanaa. Kuka tahansa linkillä voi katsoa sitä.
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button onClick={() => setShareDialogOpen(false)} className="w-full sm:w-auto">
              Valmis
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
