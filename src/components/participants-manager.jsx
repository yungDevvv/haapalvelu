"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, MoreVertical, Edit, Trash2, User, Mail, Phone, CheckCircle, XCircle, Search, Users, Grid3X3, List } from "lucide-react";
import { AddVieraskorttiDialog } from "./add-vieraskortti-dialog";
import { EditVieraskorttiDialog } from "./edit-vieraskortti-dialog";
import { useWedding } from "@/contexts/wedding-context";

export function ParticipantsManager() {
  // Get data from context
  const {
    vieraskortti,
    addVieraskortti,
    updateVieraskortti: updateCard,
    deleteVieraskortti,
    toggleCardConfirmation
  } = useWedding();

  const [isAddCardDialogOpen, setIsAddCardDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [filterCategory, setFilterCategory] = useState("kaikki");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("cards"); // "cards" or "list"

  // Categories from the image (second photo)
  const categories = [
    { value: "kaikki", label: "Kaikki" },
    { value: "perhe", label: "Perhe" },
    { value: "sukulaiset", label: "Sukulaiset" },
    { value: "ystävät", label: "Ystävät" },
    { value: "perhetutut", label: "Perhetutut" },
    { value: "työkaverit", label: "Työkaverit" },
    { value: "muut", label: "Muut" }
  ];

  // Add new card - called from AddVieraskorttiDialog
  const handleSaveNewCard = (newCardData) => {
    addVieraskortti(newCardData);
  };

  // Update card - called from EditVieraskorttiDialog
  const handleSaveEditedCard = (updatedCard) => {
    updateCard(updatedCard.id, updatedCard);
    setEditingCard(null);
  };

  // Delete card
  const handleDeleteCard = (id) => {
    deleteVieraskortti(id);
  };

  // Toggle card confirmation
  const toggleConfirmation = (id) => {
    toggleCardConfirmation(id);
  };

  // Filter cards by category and search - memoized for performance
  const filteredCards = useMemo(() => {
    return vieraskortti.filter(card => {
      const categoryMatch = filterCategory === "kaikki" || card.category === filterCategory;
      const searchMatch = searchQuery === "" || 
        card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.vieraat.some(v => 
          `${v.firstName} ${v.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return categoryMatch && searchMatch;
    });
  }, [vieraskortti, filterCategory, searchQuery]);

  // Calculate totals - memoized for performance
  const totalGuests = useMemo(() => {
    return filteredCards.reduce((sum, card) => sum + card.vieraat.length, 0);
  }, [filteredCards]);

  const confirmedCards = useMemo(() => {
    return filteredCards.filter(card => card.confirmed).length;
  }, [filteredCards]);

  return (
    <div className="space-y-6">
      {/* Header with filters and add button */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Vieraskortit</h2>
            <p className="text-muted-foreground">
              {filteredCards.length} korttia • {totalGuests} henkilöä
            </p>
          </div>
          
          <Button onClick={() => setIsAddCardDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Lisää vieraskortti
          </Button>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Hae osallistujia..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Kategoria" />
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

          {/* View mode toggle */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
            <Button
              variant={viewMode === "cards" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("cards")}
              className="h-8 px-3"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-8 px-3"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Participants Display */}
      {viewMode === "cards" ? (
        // Card View with Pairs
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* Add Pair Card */}
          <Card 
            className="relative border-2 border-dashed border-pink-300 hover:border-pink-400 cursor-pointer transition-colors"
            onClick={() => setIsAddCardDialogOpen(true)}
          >
            <CardContent className="flex flex-col items-center justify-center h-full min-h-[200px] p-6">
              <Plus className="h-12 w-12 text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-600">Lisää vieraskortti</p>
            </CardContent>
          </Card>

          {filteredCards.map((card) => (
            <Card key={card.id} className="relative hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="h-5 w-5 text-pink-500" />
                      {card.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {categories.find(c => c.value === card.category)?.label || card.category}
                      </Badge>
                      {/* <Badge 
                        variant={card.confirmed ? "default" : "secondary"}
                        className={`text-xs ${card.confirmed ? "bg-green-500" : "bg-orange-500"}`}
                      >
                        {card.confirmed ? "Vahvistettu" : "Ei vahvistettu"}
                      </Badge> */}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingCard(card)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Muokkaa korttia
                      </DropdownMenuItem>
                      {/* <DropdownMenuItem onClick={() => toggleConfirmation(card.id)}> */}
                        {/* {card.confirmed ? (
                          <>
                            <XCircle className="h-4 w-4 mr-2" />
                            Peruuta vahvistus
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Vahvista
                          </>
                        )} */}
                      {/* </DropdownMenuItem> */}
                      <DropdownMenuItem 
                        onClick={() => handleDeleteCard(card.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Poista kortti
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Guests in this card */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-500">Vieraat ({card.vieraat.length}):</p>
                  <div className="grid grid-cols-2 gap-2">
                    {card.vieraat.map((guest, index) => (
                      <div key={index} className="flex flex-col gap-1 p-2  rounded">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {guest.firstName[0]}{guest.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm truncate">
                            {guest.firstName} {guest.lastName}
                          </span>
                        </div>
                        <Badge 
                          variant={guest.rsvpStatus === "tulossa" ? "default" : "secondary"} 
                          className="text-xs w-fit ml-10"
                        >
                          {guest.rsvpStatus === "tulossa" ? "Tulossa" : "Ei vastausta"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact info */}
                <div className="border-t pt-3 space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    <span>{card.email}</span>
                  </div>
                  {card.phone && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      <span>{card.phone}</span>
                    </div>
                  )}
                  {card.address && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span>{card.address}</span>
                    </div>
                  )}
                  {card.dietaryRestrictions && (
                    <p className="text-xs text-gray-600 italic mt-2">
                      Ruokavalio: {card.dietaryRestrictions}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        // List View
        <div className="space-y-2">
          {filteredParticipants.map((participant) => (
            <Card key={participant.id} className="p-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={participant.avatar} />
                  <AvatarFallback>{participant.firstName[0]}{participant.lastName[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{participant.firstName} {participant.lastName}</h3>
                      <p className="text-sm text-muted-foreground">{participant.role}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* <Badge 
                        variant={participant.confirmed ? "default" : "secondary"}
                        className={participant.confirmed ? "bg-green-500" : "bg-orange-500"}
                      >
                        {participant.confirmed ? "Vahvistettu" : "Ei vahvistettu"}
                      </Badge> */}
                      <Badge variant="outline">
                        {categories.find(c => c.value === participant.category)?.label}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditParticipant(participant)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Muokkaa
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleConfirmation(participant.id)}>
                            {/* {participant.confirmed ? (
                              <>
                                <XCircle className="h-4 w-4 mr-2" />
                                Peruuta vahvistus
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Vahvista
                              </>
                            )} */}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteParticipant(participant.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Poista
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {participant.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {participant.phone}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Dialogs */}
      <AddVieraskorttiDialog
        open={isAddCardDialogOpen}
        onOpenChange={setIsAddCardDialogOpen}
        onSave={handleSaveNewCard}
      />

      <EditVieraskorttiDialog
        card={editingCard}
        open={!!editingCard}
        onOpenChange={(open) => !open && setEditingCard(null)}
        onSave={handleSaveEditedCard}
      />
    </div>
  );
}
