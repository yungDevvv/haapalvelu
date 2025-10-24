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
import { RichTextEditor } from "@/components/rich-text-editor";
import { Plus, MoreVertical, Edit, Trash2, FileText, User, Calendar, Search, Pin, PinOff } from "lucide-react";

export function NotesManager({ notes: initialNotes }) {
  const [notes, setNotes] = useState(initialNotes);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [filterCategory, setFilterCategory] = useState("kaikki");
  const [searchQuery, setSearchQuery] = useState("");

  // Form state for new/edit note
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "muistilista",
    createdBy: ""
  });

  const categories = [
    { value: "kaikki", label: "Kaikki muistiinpanot" },
    { value: "muistilista", label: "Muistilistat", color: "bg-blue-100 text-blue-800" },
    { value: "puheet", label: "Puheet", color: "bg-purple-100 text-purple-800" },
    { value: "ideat", label: "Ideat", color: "bg-green-100 text-green-800" },
    { value: "yhteystiedot", label: "Yhteystiedot", color: "bg-orange-100 text-orange-800" },
    { value: "budjetti", label: "Budjetti", color: "bg-red-100 text-red-800" },
    { value: "muu", label: "Muu", color: "bg-gray-100 text-gray-800" }
  ];

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      category: "muistilista",
      createdBy: ""
    });
  };

  const handleAddNote = () => {
    const newNote = {
      id: Math.max(...notes.map(n => n.id)) + 1,
      ...formData,
      createdDate: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0]
    };
    setNotes([newNote, ...notes]);
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      content: note.content,
      category: note.category,
      createdBy: note.createdBy
    });
  };

  const handleUpdateNote = () => {
    setNotes(notes.map(n => 
      n.id === editingNote.id 
        ? { ...n, ...formData, lastModified: new Date().toISOString().split('T')[0] }
        : n
    ));
    setEditingNote(null);
    resetForm();
  };

  const handleDeleteNote = (id) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const togglePin = (noteId) => {
    setNotes(notes.map(n => 
      n.id === noteId ? { ...n, pinned: !n.pinned } : n
    ));
  };

  const getCategoryInfo = (category) => {
    return categories.find(c => c.value === category) || categories[categories.length - 1];
  };

  const filteredNotes = notes.filter(note => {
    const categoryMatch = filterCategory === "kaikki" || note.category === filterCategory;
    const searchMatch = searchQuery === "" || 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fi-FI');
  };

  return (
    <div className="space-y-6">
      {/* Header with search and controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Muistiinpanot</h2>
            <p className="text-muted-foreground">
              {notes.length} muistiinpanoa
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Uusi muistiinpano
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Luo uusi muistiinpano</DialogTitle>
                <DialogDescription>
                  Luo uusi muistiinpano häävalmisteluihin.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="note-title">Otsikko</Label>
                  <Input
                    id="note-title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Esim. Muistilista vihkipäiväksi"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="note-category">Kategoria</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Valitse kategoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.slice(1).map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="note-createdBy">Tekijä</Label>
                    <Input
                      id="note-createdBy"
                      value={formData.createdBy}
                      onChange={(e) => setFormData({...formData, createdBy: e.target.value})}
                      placeholder="Kuka loi muistiinpanon?"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="note-content">Sisältö</Label>
                  <RichTextEditor
                    content={formData.content}
                    onChange={(content) => setFormData({...formData, content})}
                    placeholder="Kirjoita muistiinpanosi tähän..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Peruuta
                </Button>
                <Button onClick={handleAddNote}>
                  Tallenna muistiinpano
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and filters */}
        <div className="flex gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Hae muistiinpanoista..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Suodata kategoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotes.map((note) => {
          const categoryInfo = getCategoryInfo(note.category);
          return (
            <Card key={note.id} className={`group hover:shadow-lg transition-shadow ${note.pinned ? 'ring-2 ring-yellow-200 bg-yellow-50/30' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-lg line-clamp-2">{note.title}</CardTitle>
                    {note.pinned && (
                      <Pin className="h-4 w-4 text-yellow-600 fill-yellow-600" />
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => togglePin(note.id)}>
                        {note.pinned ? (
                          <>
                            <PinOff className="h-4 w-4 mr-2" />
                            Poista kiinnitys
                          </>
                        ) : (
                          <>
                            <Pin className="h-4 w-4 mr-2" />
                            Kiinnitä etusivulle
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditNote(note)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Muokkaa
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteNote(note.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Poista
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center justify-between">
                  <Badge className={categoryInfo.color}>
                    {categoryInfo.label}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="text-sm text-muted-foreground line-clamp-4">
                  {note.content.split('\n').map((line, index) => (
                    <div key={index}>{line}</div>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {note.createdBy}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(note.lastModified)}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredNotes.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Ei muistiinpanoja</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery || filterCategory !== "kaikki" 
              ? "Ei hakuehtoja vastaavia muistiinpanoja."
              : "Aloita luomalla ensimmäinen muistiinpano."
            }
          </p>
          {(searchQuery || filterCategory !== "kaikki") && (
            <Button variant="outline" onClick={() => {
              setSearchQuery("");
              setFilterCategory("kaikki");
            }}>
              Tyhjennä suodattimet
            </Button>
          )}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingNote} onOpenChange={() => setEditingNote(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Muokkaa muistiinpanoa</DialogTitle>
            <DialogDescription>
              Muokkaa muistiinpanon tietoja.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Otsikko</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-category">Kategoria</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Valitse kategoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.slice(1).map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-createdBy">Tekijä</Label>
                <Input
                  id="edit-createdBy"
                  value={formData.createdBy}
                  onChange={(e) => setFormData({...formData, createdBy: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-content">Sisältö</Label>
              <RichTextEditor
                content={formData.content}
                onChange={(content) => setFormData({...formData, content})}
                placeholder="Kirjoita muistiinpanosi tähän..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingNote(null)}>
              Peruuta
            </Button>
            <Button onClick={handleUpdateNote}>
              Tallenna muutokset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
