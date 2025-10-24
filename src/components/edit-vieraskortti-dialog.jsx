"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";

// Zod schema for validation
const cardSchema = z.object({
  title: z.string().min(1, "Kortin nimi on pakollinen"),
  category: z.string().min(1, "Ryhmä on pakollinen"),
  email: z.string().email("Virheellinen sähköpostiosoite").min(1, "Sähköposti on pakollinen"),
  phone: z.string().optional(),
  address: z.string().optional(),
  dietaryRestrictions: z.string().optional(),
});

const categories = [
  { value: "perhe", label: "Perhe" },
  { value: "sukulaiset", label: "Sukulaiset" },
  { value: "ystävät", label: "Ystävät" },
  { value: "perhetutut", label: "Perhetutut" },
  { value: "työkaverit", label: "Työkaverit" },
  { value: "muut", label: "Muut" }
];

export function EditVieraskorttiDialog({ card, open, onOpenChange, onSave }) {
  const [guestsInCard, setGuestsInCard] = useState([]);
  const [tempGuest, setTempGuest] = useState({ firstName: "", lastName: "", rsvpStatus: "ei_vastausta" });

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      title: "",
      category: "",
      email: "",
      phone: "",
      address: "",
      dietaryRestrictions: "",
    }
  });

  const selectedCategory = watch("category");

  // Load card data when dialog opens
  useEffect(() => {
    if (card && open) {
      reset({
        title: card.title || "",
        category: card.category || "",
        email: card.email || "",
        phone: card.phone || "",
        address: card.address || "",
        dietaryRestrictions: card.dietaryRestrictions || "",
      });
      setGuestsInCard(card.vieraat ? [...card.vieraat] : []);
    }
  }, [card, open, reset]);

  // Add guest to temporary list
  const addGuestToCard = () => {
    if (!tempGuest.firstName || !tempGuest.lastName) return;
    
    setGuestsInCard([...guestsInCard, {
      firstName: tempGuest.firstName,
      lastName: tempGuest.lastName,
      rsvpStatus: tempGuest.rsvpStatus
    }]);
    setTempGuest({ firstName: "", lastName: "", rsvpStatus: "ei_vastausta" });
  };

  // Remove guest from temporary list
  const removeGuestFromCard = (index) => {
    setGuestsInCard(guestsInCard.filter((_, i) => i !== index));
  };

  // Handle form submission
  const onSubmit = (data) => {
    if (guestsInCard.length === 0) {
      alert("Lisää vähintään yksi vieras!");
      return;
    }

    const updatedCard = {
      ...card,
      ...data,
      vieraat: guestsInCard,
    };

    onSave(updatedCard);
    handleClose();
  };

  const handleClose = () => {
    reset();
    setGuestsInCard([]);
    setTempGuest({ firstName: "", lastName: "", rsvpStatus: "ei_vastausta" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Muokkaa vieraskorttia</DialogTitle>
          <DialogDescription>
            Muokkaa vieraskortin tietoja.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Card Info */}
          <div className="space-y-2">
            <Label>Kortin nimi *</Label>
            <Input
              {...register("title")}
              placeholder="Esim. Morsiamen vanhemmat..."
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label>Ryhmä *</Label>
            <Select value={selectedCategory} onValueChange={(value) => setValue("category", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category.message}</p>
            )}
          </div>

          {/* Contact Info */}
          <div className="border-t pt-4 space-y-2">
            <h4 className="font-medium text-sm">Yhteystiedot</h4>
            <div className="space-y-2">
              <Input
                placeholder="Sähköposti *"
                type="email"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <Input
              placeholder="Puhelinnumero"
              {...register("phone")}
            />
            <Input
              placeholder="Osoite"
              {...register("address")}
            />
            <Textarea
              placeholder="Ruokavaliorajoitukset"
              {...register("dietaryRestrictions")}
            />
          </div>

          {/* Guests in card */}
          <div className="border-t pt-4 space-y-2">
            <h4 className="font-medium text-sm">Vieraat ({guestsInCard.length})</h4>
            {guestsInCard.length > 0 && (
              <div className="space-y-2 max-h-[150px] overflow-y-auto">
                {guestsInCard.map((guest, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{guest.firstName} {guest.lastName}</span>
                      <Badge variant={guest.rsvpStatus === "tulossa" ? "default" : "secondary"} className="text-xs">
                        {guest.rsvpStatus === "tulossa" ? "Tulossa" : "Ei vastausta"}
                      </Badge>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeGuestFromCard(index)}
                      className="h-6 w-6 p-0 text-red-600"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Add guest form */}
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Etunimi"
                value={tempGuest.firstName}
                onChange={(e) => setTempGuest({...tempGuest, firstName: e.target.value})}
              />
              <Input
                placeholder="Sukunimi"
                value={tempGuest.lastName}
                onChange={(e) => setTempGuest({...tempGuest, lastName: e.target.value})}
              />
            </div>
            <Select 
              value={tempGuest.rsvpStatus} 
              onValueChange={(value) => setTempGuest({...tempGuest, rsvpStatus: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tulossa">Tulossa</SelectItem>
                <SelectItem value="ei_vastausta">Ei vastausta</SelectItem>
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addGuestToCard}
              disabled={!tempGuest.firstName || !tempGuest.lastName}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Lisää vieras
            </Button>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Peruuta
            </Button>
            <Button type="submit">
              Tallenna muutokset
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
