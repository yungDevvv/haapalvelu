"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Calendar from "react-calendar";
import { format, isSameDay, parseISO } from "date-fns";
import { fi } from "date-fns/locale";
import "react-calendar/dist/Calendar.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { DatePicker } from "@/components/ui/date-picker";
import { Plus, Search, Calendar as CalendarIcon, Users, Tag, MoreVertical, Edit, Trash2, CheckCircle2, Clock, AlertCircle, User, Star, Filter, Target, Zap, AlertTriangle, Pin, CheckCheck, X } from "lucide-react";
import { staggerContainer, staggerItem, hoverLift } from "@/lib/animations";

export function TasksManagerImproved({ tasks: initialTasks, participants }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [showAllTasks, setShowAllTasks] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [viewCategoryModal, setViewCategoryModal] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [groupBy, setGroupBy] = useState("category"); // status, category, assignee, date
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [customCategories, setCustomCategories] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    assignedTo: "",
    status: "odottaa",
    priority: "keskitaso",
    category: "yleinen",
    emoji: "📋"
  });

  // New category form
  const [newCategory, setNewCategory] = useState({
    label: "",
    emoji: "📋",
    color: "bg-gray-100"
  });

  // Categories for grouping
  const defaultCategories = [
    { value: "all", label: "Kaikki tehtävät", emoji: "📋", color: "bg-gray-100" },
    { value: "catering", label: "Catering", emoji: "🍽️", color: "bg-orange-100" },
    { value: "kukat", label: "Kukat ja koristeet", emoji: "💐", color: "bg-pink-100" },
    { value: "musiikki", label: "Musiikki", emoji: "🎵", color: "bg-purple-100" },
    { value: "valokuvaus", label: "Valokuvaus", emoji: "📸", color: "bg-blue-100" },
    { value: "paikka", label: "Paikka ja tilat", emoji: "🏛️", color: "bg-green-100" },
    { value: "vieraat", label: "Vieraat", emoji: "👥", color: "bg-yellow-100" },
    { value: "yleinen", label: "Yleinen", emoji: "📋", color: "bg-gray-100" }
  ];

  const categories = [...defaultCategories, ...customCategories];

  const colorOptions = [
    { value: "bg-orange-100", label: "Oranssi" },
    { value: "bg-pink-100", label: "Pinkki" },
    { value: "bg-purple-100", label: "Violetti" },
    { value: "bg-blue-100", label: "Sininen" },
    { value: "bg-green-100", label: "Vihreä" },
    { value: "bg-yellow-100", label: "Keltainen" },
    { value: "bg-red-100", label: "Punainen" },
    { value: "bg-gray-100", label: "Harmaa" }
  ];

  const handleAddCategory = () => {
    const categoryValue = newCategory.label.toLowerCase().replace(/\s+/g, '_');
    const category = {
      value: categoryValue,
      label: newCategory.label,
      emoji: newCategory.emoji,
      color: newCategory.color
    };
    setCustomCategories([...customCategories, category]);
    setNewCategory({ label: "", emoji: "📋", color: "bg-gray-100" });
    setIsAddCategoryOpen(false);
  };

  const statusConfig = {
    odottaa: { label: "Odottaa", color: "bg-yellow-50 border-yellow-200", textColor: "text-yellow-700", icon: Clock },
    kesken: { label: "Kesken", color: "bg-blue-50 border-blue-200", textColor: "text-blue-700", icon: AlertCircle },
    valmis: { label: "Valmis", color: "bg-green-50 border-green-200", textColor: "text-green-700", icon: CheckCircle2 }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      dueDate: "",
      assignedTo: "",
      status: "odottaa",
      priority: "keskitaso",
      category: "yleinen",
      emoji: "📋"
    });
  };

  const handleAddTask = () => {
    const newTask = {
      id: Math.max(...tasks.map(t => t.id), 0) + 1,
      ...formData,
      pinned: false
    };
    setTasks([...tasks, newTask]);
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const toggleStatus = (taskId) => {
    setTasks(tasks.map(t => {
      if (t.id === taskId) {
        const statuses = ["odottaa", "kesken", "valmis"];
        const currentIndex = statuses.indexOf(t.status);
        const nextStatus = statuses[(currentIndex + 1) % statuses.length];
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  const toggleFavorite = (taskId) => {
    setTasks(tasks.map(t => 
      t.id === taskId ? { ...t, favorite: !t.favorite } : t
    ));
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const categoryMatch = selectedCategory === "all" || task.category === selectedCategory;
    const searchMatch = searchQuery === "" || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const dateMatch = !selectedDate || isSameDay(parseISO(task.dueDate), selectedDate);
    return categoryMatch && searchMatch && dateMatch;
  });

  // Group tasks
  const groupedTasks = () => {
    if (groupBy === "status") {
      return {
        odottaa: filteredTasks.filter(t => t.status === "odottaa"),
        kesken: filteredTasks.filter(t => t.status === "kesken"),
        valmis: filteredTasks.filter(t => t.status === "valmis")
      };
    } else if (groupBy === "category") {
      const grouped = {};
      categories.forEach(cat => {
        if (cat.value !== "all") {
          grouped[cat.value] = filteredTasks.filter(t => t.category === cat.value);
        }
      });
    
      return grouped;
    }
     
    return { all: filteredTasks };
  };

  const taskGroups = groupedTasks();
  const completedTasks = tasks.filter(t => t.status === "valmis").length;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Get tasks for calendar
  const getTasksForDate = (date) => {
    return tasks.filter(task => isSameDay(parseISO(task.dueDate), date));
  };

  const CompactTaskItem = ({ task }) => {
    const status = statusConfig[task.status];
    const StatusIcon = status.icon;

    return (
      <div className="flex items-center justify-between p-2 bg-white rounded-lg border hover:border-pink-200 transition-colors group">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-sm font-medium truncate">{task.title}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => toggleStatus(task.id)}
          >
            <StatusIcon className={`h-3 w-3 ${status.textColor}`} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => toggleFavorite(task.id)}
          >
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          </Button>
        </div>
      </div>
    );
  };

  const TaskCard = ({ task }) => {
    const status = statusConfig[task.status];
    const category = categories.find(c => c.value === task.category) || categories[categories.length - 1];
    const StatusIcon = status.icon;

    return (
      <div>
        <Card className="bg-white border hover:border-pink-300 transition-colors cursor-pointer group">
          <CardContent className="p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm line-clamp-1">
                  {task.title}
                </h4>
                {task.description && (
                  <p className="text-xs text-gray-600 mt-1 line-clamp-1">{task.description}</p>
                )}
              </div>
              
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => toggleFavorite(task.id)}
                  title="Suosikki"
                >
                  <Star className={`h-4 w-4 ${task.favorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => toggleStatus(task.id)}
                  title={status.label}
                >
                  <StatusIcon className={`h-4 w-4 ${status.textColor}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100"
                  onClick={() => handleDeleteTask(task.id)}
                >
                  <Trash2 className="h-3 w-3 text-red-500" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-2 text-xs">
              <div className="flex items-center gap-1 text-gray-600">
                <User className="h-3 w-3" />
                <span className="truncate">{task.assignedTo}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500">
                <CalendarIcon className="h-3 w-3" />
                <span>{format(parseISO(task.dueDate), "d.M", { locale: fi })}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-6 items-start justify-between">
        <div className="flex-1">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-2">
            Tehtävälista
          </h2>
          <p className="text-gray-600">
            {completedTasks}/{totalTasks} tehtävää valmis • {Math.round(completionPercentage)}% valmiina
          </p>
          
          {/* Progress */}
          <div className="mt-4 bg-white p-4 rounded-xl border shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Kokonaisedistyminen</span>
              <span className="text-sm font-bold text-pink-500">{Math.round(completionPercentage)}%</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>{tasks.filter(t => t.status === "odottaa").length} odottaa</span>
              <span>{tasks.filter(t => t.status === "kesken").length} kesken</span>
              <span>{completedTasks} valmis</span>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <Card className="w-full lg:w-auto">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Kalenteri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              locale="fi-FI"
              className="border-none"
              tileContent={({ date }) => {
                const tasksForDate = getTasksForDate(date);
                if (tasksForDate.length > 0) {
                  return (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                      <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                        {tasksForDate.length}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            {selectedDate && (
              <div className="mt-3 space-y-2">
                <div className="text-sm font-medium text-gray-700 text-center">
                  {format(selectedDate, "d. MMMM yyyy", { locale: fi })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2 items-center">
          <Button
            variant={showAllTasks ? "default" : "outline"}
            onClick={() => setShowAllTasks(!showAllTasks)}
            className={showAllTasks ? "bg-gradient-to-r from-pink-500 to-purple-500" : "border-pink-200 hover:bg-pink-50"}
          >
            <Tag className="h-4 w-4 mr-2" />
            {showAllTasks ? "Näytä kategoriat" : "Näytä kaikki tehtävät"}
          </Button>
          
          {!showAllTasks && (
            <Button
              variant="outline"
              onClick={() => setIsAddCategoryOpen(true)}
              className="border-purple-200 hover:bg-purple-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Uusi kategoria
            </Button>
          )}

          <AnimatePresence mode="wait">
            {selectedDate && (
              <motion.div
                key="date-filter"
                initial={{ opacity: 0, scale: 0.8, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: -20 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <Badge 
                  variant="secondary" 
                  className="bg-purple-100 text-purple-700 px-3 py-1.5 text-sm font-medium flex items-center gap-2"
                >
                  <CalendarIcon className="h-3.5 w-3.5" />
                  {format(selectedDate, "d. MMMM yyyy", { locale: fi })}
                  <button
                    onClick={() => setSelectedDate(null)}
                    className="ml-1 hover:bg-purple-200 rounded-full p-0.5 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
              <Plus className="h-4 w-4 mr-2" />
              Uusi tehtävä
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Lisää uusi tehtävä</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Tehtävän nimi</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Esim. Tilaa kukkakimput"
                />
              </div>
              <div className="space-y-2">
                <Label>Kuvaus</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Kategoria</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter(c => c.value !== "all").map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.emoji} {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Määräaika</Label>
                  <DatePicker
                    date={formData.dueDate ? new Date(formData.dueDate) : undefined}
                    onDateChange={(selectedDate) => {
                      if (selectedDate) {
                        setFormData({...formData, dueDate: selectedDate.toISOString().split('T')[0]});
                      }
                    }}
                    placeholder="Valitse määräaika"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Vastuuhenkilö</Label>
                <Select value={formData.assignedTo} onValueChange={(value) => setFormData({...formData, assignedTo: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {participants.map(p => (
                      <SelectItem key={p.id} value={`${p.firstName} ${p.lastName}`}>
                        {p.firstName} {p.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Peruuta
              </Button>
              <Button onClick={handleAddTask}>
                Lisää tehtävä
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tasks Display - Categories or All Tasks */}
      {showAllTasks || selectedDate ? (
        /* All Tasks List Grouped by Category */
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              {selectedDate 
                ? `Tehtävät ${format(selectedDate, "d.M.yyyy", { locale: fi })} (${filteredTasks.length})`
                : `Kaikki tehtävät (${filteredTasks.length})`
              }
            </h3>
            {!selectedDate && (
              <div className="relative flex-1 max-w-md ml-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Hae tehtäviä..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            )}
          </div>
          
          {Object.entries(taskGroups).map(([key, groupTasks], index) => {
            const category = categories.find(c => c.value === key);
            if (!category || groupTasks.length === 0) return null;

            return (
              <div key={key}>
                {index > 0 && <div className="border-t my-6"></div>}
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{category.emoji}</span>
                    <h4 className="font-semibold text-base">{category.label}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {groupTasks.length}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {groupTasks.map(task => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
          
          {filteredTasks.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Tag className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Ei tehtäviä</p>
            </div>
          )}
        </div>
      ) : (
        /* Tasks by Categories */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Object.entries(taskGroups).map(([key, groupTasks]) => {
            const category = categories.find(c => c.value === key);
            if (!category) return null;

            const completedInCategory = groupTasks.filter(t => t.status === "valmis").length;
            const progressPercent = groupTasks.length > 0 ? (completedInCategory / groupTasks.length) * 100 : 0;
            const favoriteTasks = groupTasks.filter(t => t.favorite);

            return (
              <div key={key}>
                <Card className={`${category.color} border-2`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{category.emoji}</span>
                        <div>
                          <CardTitle className="text-base">{category.label}</CardTitle>
                          <p className="text-xs text-gray-600 mt-0.5">
                            {completedInCategory}/{groupTasks.length} valmis
                            {favoriteTasks.length > 0 && ` • ${favoriteTasks.length} suosikki`}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-sm">
                        {groupTasks.length}
                      </Badge>
                    </div>
                    {groupTasks.length > 0 && (
                      <Progress value={progressPercent} className="h-1.5 mt-2" />
                    )}
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    {groupTasks.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">
                        <span className="text-3xl block mb-2">{category.emoji}</span>
                        <p className="text-sm">Ei tehtäviä</p>
                      </div>
                    ) : (
                      <>
                        {favoriteTasks.length > 0 && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-1 text-xs font-medium text-gray-600">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              Suosikit
                            </div>
                            {favoriteTasks.map(task => (
                              <CompactTaskItem key={task.id} task={task} />
                            ))}
                          </div>
                        )}
                        
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => setViewCategoryModal(category)}
                        >
                          <Tag className="h-4 w-4 mr-2" />
                          Näytä kaikki tehtävät ({groupTasks.length})
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Category Modal */}
      <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lisää uusi kategoria</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Kategorian nimi</Label>
              <Input
                value={newCategory.label}
                onChange={(e) => setNewCategory({...newCategory, label: e.target.value})}
                placeholder="Esim. Hääpuku"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Emoji</Label>
              <Input
                value={newCategory.emoji}
                onChange={(e) => setNewCategory({...newCategory, emoji: e.target.value})}
                placeholder="👗"
                maxLength={2}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Väri</Label>
              <Select value={newCategory.color} onValueChange={(value) => setNewCategory({...newCategory, color: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map(color => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded ${color.value}`}></div>
                        {color.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCategoryOpen(false)}>
              Peruuta
            </Button>
            <Button onClick={handleAddCategory} disabled={!newCategory.label}>
              Lisää kategoria
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Category Tasks Modal */}
      <Dialog open={!!viewCategoryModal} onOpenChange={() => setViewCategoryModal(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-2xl">{viewCategoryModal?.emoji}</span>
              {viewCategoryModal?.label}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-[70vh] overflow-y-auto">
            {viewCategoryModal && taskGroups[viewCategoryModal.value]?.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
