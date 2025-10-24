"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";

// Universal block editor dialog
export default function EditBlockDialog({ block, open, onOpenChange, onSave }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (block) {
      setFormData({ ...block.data });
    }
  }, [block]);

  if (!block) return null;

  const handleSave = () => {
    onSave(formData);
    onOpenChange(false);
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateEvent = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      events: prev.events.map((event, i) => 
        i === index ? { ...event, [field]: value } : event
      )
    }));
  };

  const addEvent = () => {
    setFormData(prev => ({
      ...prev,
      events: [...(prev.events || []), { time: "", title: "", description: "", location: "" }]
    }));
  };

  const removeEvent = (index) => {
    setFormData(prev => ({
      ...prev,
      events: prev.events.filter((_, i) => i !== index)
    }));
  };

  // Hero block editor
  if (block.type === 'hero') {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Muokkaa Hero-lohkoa</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Otsikko *</Label>
              <Input 
                value={formData.title || ""} 
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="Anna & Mikael"
              />
            </div>

            <div>
              <Label>Alaotsikko</Label>
              <Input 
                value={formData.subtitle || ""} 
                onChange={(e) => updateField('subtitle', e.target.value)}
                placeholder="Suomenlinna, Helsinki"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Päivämäärä</Label>
                <Input 
                  value={formData.date || ""} 
                  onChange={(e) => updateField('date', e.target.value)}
                  placeholder="15.07.2024"
                />
              </div>

              <div>
                <Label>Paikka</Label>
                <Input 
                  value={formData.location || ""} 
                  onChange={(e) => updateField('location', e.target.value)}
                  placeholder="Helsinki"
                />
              </div>
            </div>

            <div>
              <Label>Taustakuvan URL (valinnainen)</Label>
              <Input 
                value={formData.backgroundImage || ""} 
                onChange={(e) => updateField('backgroundImage', e.target.value)}
                placeholder="https://..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Jätä tyhjäksi käyttääksesi gradient-taustaa
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Peruuta
            </Button>
            <Button onClick={handleSave}>Tallenna</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Countdown block editor
  if (block.type === 'countdown') {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Muokkaa Countdown-lohkoa</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Otsikko *</Label>
              <Input 
                value={formData.title || ""} 
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="Aikaa Häihin"
              />
            </div>

            <div>
              <Label>Kohde päivämäärä *</Label>
              <Input 
                type="datetime-local"
                value={formData.targetDate || ""} 
                onChange={(e) => updateField('targetDate', e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Peruuta
            </Button>
            <Button onClick={handleSave}>Tallenna</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Program block editor
  if (block.type === 'program') {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Muokkaa Ohjelma-lohkoa</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Otsikko *</Label>
              <Input 
                value={formData.title || ""} 
                onChange={(e) => updateField('title', e.target.value)}
              />
            </div>

            <div>
              <Label>Kuvaus</Label>
              <Textarea 
                value={formData.description || ""} 
                onChange={(e) => updateField('description', e.target.value)}
                rows={2}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Tapahtumat</Label>
                <Button size="sm" variant="outline" onClick={addEvent}>
                  + Lisää tapahtuma
                </Button>
              </div>

              <div className="space-y-3">
                {(formData.events || []).map((event, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs">Aika</Label>
                        <Input 
                          value={event.time || ""} 
                          onChange={(e) => updateEvent(index, 'time', e.target.value)}
                          placeholder="15:00"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label className="text-xs">Otsikko</Label>
                        <Input 
                          value={event.title || ""} 
                          onChange={(e) => updateEvent(index, 'title', e.target.value)}
                          placeholder="Vihkiminen"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs">Kuvaus</Label>
                      <Input 
                        value={event.description || ""} 
                        onChange={(e) => updateEvent(index, 'description', e.target.value)}
                        placeholder="Kirkossa pidettävä vihkiseremonia"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <Label className="text-xs">Paikka</Label>
                        <Input 
                          value={event.location || ""} 
                          onChange={(e) => updateEvent(index, 'location', e.target.value)}
                          placeholder="Tuomiokirkko"
                        />
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-red-600 mt-5"
                        onClick={() => removeEvent(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Peruuta
            </Button>
            <Button onClick={handleSave}>Tallenna</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // RSVP block editor
  if (block.type === 'rsvp') {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Muokkaa RSVP-lohkoa</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Otsikko *</Label>
              <Input 
                value={formData.title || ""} 
                onChange={(e) => updateField('title', e.target.value)}
              />
            </div>

            <div>
              <Label>Kuvaus</Label>
              <Textarea 
                value={formData.description || ""} 
                onChange={(e) => updateField('description', e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Peruuta
            </Button>
            <Button onClick={handleSave}>Tallenna</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Gallery block editor
  if (block.type === 'gallery') {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Muokkaa Galleria-lohkoa</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Otsikko *</Label>
              <Input 
                value={formData.title || ""} 
                onChange={(e) => updateField('title', e.target.value)}
              />
            </div>

            <div>
              <Label>Kuvaus</Label>
              <Textarea 
                value={formData.description || ""} 
                onChange={(e) => updateField('description', e.target.value)}
                rows={2}
              />
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                💡 Kuvien lataus tulossa seuraavaan versioon. 
                Toistaiseksi galleria näyttää paikkamerkit.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Peruuta
            </Button>
            <Button onClick={handleSave}>Tallenna</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Text block editor
  if (block.type === 'text') {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Muokkaa Teksti-lohkoa</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Otsikko</Label>
              <Input 
                value={formData.title || ""} 
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="Meidän Tarinамme"
              />
            </div>

            <div>
              <Label>Sisältö *</Label>
              <Textarea 
                value={formData.content || ""} 
                onChange={(e) => updateField('content', e.target.value)}
                rows={10}
                placeholder="Kirjoita tarinanne..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Peruuta
            </Button>
            <Button onClick={handleSave}>Tallenna</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return null;
}
