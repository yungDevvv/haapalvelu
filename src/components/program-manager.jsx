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
import { DatePicker } from "@/components/ui/date-picker";
import { Plus, MoreVertical, Edit, Trash2, MapPin, Clock, Calendar, Users } from "lucide-react";

export function ProgramManager({ program: initialProgram, participants }) {
  const [program, setProgram] = useState(initialProgram);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [filterType, setFilterType] = useState("kaikki");

  // Form state for new/edit event
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    type: "",
    status: "suunniteltu",
    participants: []
  });

  const eventTypes = [
    { value: "polttarit", label: "Polttarit", color: "bg-purple-500" },
    { value: "vihkiminen", label: "Vihkiminen", color: "bg-pink-500" },
    { value: "kuvaus", label: "Kuvaus", color: "bg-blue-500" },
    { value: "juhlat", label: "Juhlat", color: "bg-green-500" },
    { value: "hamatka", label: "Häämatkä", color: "bg-orange-500" },
    { value: "muu", label: "Muu", color: "bg-gray-500" }
  ];

  const statusOptions = [
    { value: "suunniteltu", label: "Suunniteltu" },
    { value: "vahvistettu", label: "Vahvistettu" },
    { value: "peruttu", label: "Peruttu" },
    { value: "valmis", label: "Valmis" }
  ];

  const resetForm = () => {
    setFormData({
      title: "",
      date: "",
      time: "",
      location: "",
      description: "",
      type: "",
      status: "suunniteltu",
      participants: []
    });
  };

  const handleAddEvent = () => {
    const newEvent = {
      id: Math.max(...program.map(e => e.id)) + 1,
      ...formData
    };
    setProgram([...program, newEvent].sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time)));
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      description: event.description,
      type: event.type,
      status: event.status,
      participants: Array.isArray(event.participants) ? event.participants : []
    });
  };

  const handleUpdateEvent = () => {
    setProgram(program.map(e => 
      e.id === editingEvent.id 
        ? { ...e, ...formData }
        : e
    ).sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time)));
    setEditingEvent(null);
    resetForm();
  };

  const handleDeleteEvent = (id) => {
    setProgram(program.filter(e => e.id !== id));
  };

  const getEventTypeInfo = (type) => {
    return eventTypes.find(t => t.value === type) || eventTypes[eventTypes.length - 1];
  };

  const getParticipantNames = (eventParticipants) => {
    if (eventParticipants === "kaikki") return "Kaikki vierat";
    if (!Array.isArray(eventParticipants)) return "Ei määritelty";
    
    const names = eventParticipants.map(id => {
      const participant = participants.find(p => p.id === id);
      return participant ? `${participant.firstName} ${participant.lastName}` : "";
    }).filter(Boolean);
    
    return names.length > 0 ? names.join(", ") : "Ei vieraita";
  };

  const filteredProgram = filterType === "kaikki" 
    ? program 
    : program.filter(e => e.type === filterType);

  return (
    <div className="space-y-6">
      {/* Header with filters and add button */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Hääohjelma</h2>
          <p className="text-muted-foreground">
            {program.filter(e => e.status === "vahvistettu").length}/{program.length} vahvistettu
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Suodata tyyppi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kaikki">Kaikki tapahtumat</SelectItem>
              {eventTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Lisää tapahtuma
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Lisää uusi tapahtuma</DialogTitle>
                <DialogDescription>
                  Luo uusi tapahtuma häähjelmaasi.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Tapahtuman nimi</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Esim. Vihkiseremonia"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Päivämäärä</Label>
                    <DatePicker
                      date={formData.date ? new Date(formData.date) : undefined}
                      onDateChange={(selectedDate) => {
                        if (selectedDate) {
                          setFormData({...formData, date: selectedDate.toISOString().split('T')[0]});
                        }
                      }}
                      placeholder="Valitse päivämäärä"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Aika</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Sijainti</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="Esim. Suomenlinnan kirkko"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Tyyppi</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Valitse tyyppi" />
                      </SelectTrigger>
                      <SelectContent>
                        {eventTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Tila</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Valitse tila" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Kuvaus</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Tapahtuman yksityiskohdat..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Peruuta
                </Button>
                <Button onClick={handleAddEvent}>
                  Lisää tapahtuma
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Program Timeline */}
      <div className="space-y-4">
        {filteredProgram.map((event, index) => {
          const typeInfo = getEventTypeInfo(event.type);
          return (
            <Card key={event.id} className="relative">
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${typeInfo.color} rounded-l-lg`}></div>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <Badge variant={event.status === "vahvistettu" ? "default" : 
                                   event.status === "valmis" ? "secondary" :
                                   event.status === "peruttu" ? "destructive" : "outline"}>
                        {statusOptions.find(s => s.value === event.status)?.label}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {typeInfo.label}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {event.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </div>
                    </div>
                    
                    <CardDescription className="mb-3">
                      {event.description}
                    </CardDescription>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {getParticipantNames(event.participants)}
                      </span>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditEvent(event)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Muokkaa
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteEvent(event.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Poista
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingEvent} onOpenChange={() => setEditingEvent(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Muokkaa tapahtumaa</DialogTitle>
            <DialogDescription>
              Muokkaa tapahtuman tietoja.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Tapahtuman nimi</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-date">Päivämäärä</Label>
                <DatePicker
                  date={formData.date ? new Date(formData.date) : undefined}
                  onDateChange={(selectedDate) => {
                    if (selectedDate) {
                      setFormData({...formData, date: selectedDate.toISOString().split('T')[0]});
                    }
                  }}
                  placeholder="Valitse päivämäärä"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-time">Aika</Label>
                <Input
                  id="edit-time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-location">Sijainti</Label>
              <Input
                id="edit-location"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-type">Tyyppi</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Valitse tyyppi" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Tila</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Valitse tila" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-description">Kuvaus</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingEvent(null)}>
              Peruuta
            </Button>
            <Button onClick={handleUpdateEvent}>
              Tallenna muutokset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
