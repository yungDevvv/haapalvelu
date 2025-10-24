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
import { Progress } from "@/components/ui/progress";
import { Plus, MoreVertical, Edit, Trash2, CheckCircle, Clock, AlertCircle, User, Calendar, Search, Filter, Target, Zap, AlertTriangle, Pin, PinOff } from "lucide-react";

export function TasksManager({ tasks: initialTasks, participants }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState("kaikki");
  const [viewMode, setViewMode] = useState("kanban"); // "kanban" or "list"

  // Form state for new/edit task
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    assignedTo: "",
    status: "odottaa",
    priority: "keskitaso"
  });

  const statusColumns = [
    { 
      value: "odottaa", 
      label: "Odottaa", 
      color: "bg-gray-100 border-gray-200", 
      headerColor: "bg-gray-50",
      icon: Clock,
      description: "Tehtävät jotka odottavat aloitusta"
    },
    { 
      value: "kesken", 
      label: "Kesken", 
      color: "bg-blue-100 border-blue-200", 
      headerColor: "bg-blue-50",
      icon: AlertCircle,
      description: "Käynnissä olevat tehtävät"
    },
    { 
      value: "valmis", 
      label: "Valmis", 
      color: "bg-green-100 border-green-200", 
      headerColor: "bg-green-50",
      icon: CheckCircle,
      description: "Valmiit tehtävät"
    }
  ];

  const priorityOptions = [
    { value: "matala", label: "Matala", color: "text-green-600 bg-green-100 border-green-200", icon: Target },
    { value: "keskitaso", label: "Keskitaso", color: "text-blue-600 bg-blue-100 border-blue-200", icon: Zap },
    { value: "korkea", label: "Korkea", color: "text-red-600 bg-red-100 border-red-200", icon: AlertTriangle }
  ];

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      dueDate: "",
      assignedTo: "",
      status: "odottaa",
      priority: "keskitaso"
    });
  };

  const handleAddTask = () => {
    const newTask = {
      id: Math.max(...tasks.map(t => t.id)) + 1,
      ...formData
    };
    setTasks([...tasks, newTask]);
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      assignedTo: task.assignedTo,
      status: task.status,
      priority: task.priority
    });
  };

  const handleUpdateTask = () => {
    setTasks(tasks.map(t => 
      t.id === editingTask.id 
        ? { ...t, ...formData }
        : t
    ));
    setEditingTask(null);
    resetForm();
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const moveTask = (taskId, newStatus) => {
    setTasks(tasks.map(t => 
      t.id === taskId ? { ...t, status: newStatus } : t
    ));
  };

  const togglePin = (taskId) => {
    setTasks(tasks.map(t => 
      t.id === taskId ? { ...t, pinned: !t.pinned } : t
    ));
  };

  const getPriorityInfo = (priority) => {
    return priorityOptions.find(p => p.value === priority) || priorityOptions[1];
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const priorityMatch = filterPriority === "kaikki" || task.priority === filterPriority;
    const searchMatch = searchQuery === "" || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());
    return priorityMatch && searchMatch;
  });

  // Group tasks by status
  const tasksByStatus = statusColumns.reduce((acc, status) => {
    acc[status.value] = filteredTasks.filter(task => task.status === status.value);
    return acc;
  }, {});

  const completedTasks = tasks.filter(t => t.status === "valmis").length;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Get assignee options from participants
  const assigneeOptions = [
    ...participants.map(p => ({ value: `${p.firstName} ${p.lastName}`, label: `${p.firstName} ${p.lastName}` })),
    { value: "Muu", label: "Muu henkilö" }
  ];

  const TaskCard = ({ task }) => {
    const priorityInfo = getPriorityInfo(task.priority);
    const daysUntilDue = getDaysUntilDue(task.dueDate);
    const PriorityIcon = priorityInfo.icon;

    return (
      <Card className={`mb-3 hover:shadow-md transition-shadow cursor-pointer group ${task.pinned ? 'ring-2 ring-yellow-200 bg-yellow-50/30' : ''}`}>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-sm font-medium group-hover:text-blue-600 transition-colors">
                  {task.title}
                </CardTitle>
                {task.pinned && (
                  <Pin className="h-3 w-3 text-yellow-600 fill-yellow-600" />
                )}
              </div>
              {task.description && (
                <CardDescription className="text-xs line-clamp-2 mb-2">
                  {task.description}
                </CardDescription>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => togglePin(task.id)}>
                  {task.pinned ? (
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
                <DropdownMenuItem onClick={() => handleEditTask(task)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Muokkaa
                </DropdownMenuItem>
                {task.status !== "valmis" && (
                  <DropdownMenuItem onClick={() => moveTask(task.id, "valmis")}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Merkitse valmiiksi
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem 
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Poista
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="space-y-2">
            {/* Priority and Due Date */}
            <div className="flex items-center justify-between">
              <Badge className={`${priorityInfo.color} text-xs`}>
                <PriorityIcon className="h-3 w-3 mr-1" />
                {priorityInfo.label}
              </Badge>
              {daysUntilDue < 0 && (
                <Badge variant="destructive" className="text-xs">
                  Myöhässä
                </Badge>
              )}
              {daysUntilDue >= 0 && daysUntilDue <= 3 && task.status !== "valmis" && (
                <Badge variant="outline" className="text-xs text-orange-600 border-orange-200">
                  {daysUntilDue === 0 ? "Tänään" : `${daysUntilDue}pv`}
                </Badge>
              )}
            </div>
            
            {/* Assignee and Date */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span className="truncate">{task.assignedTo}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{new Date(task.dueDate).toLocaleDateString('fi-FI', { month: 'short', day: 'numeric' })}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Tehtävälista
            </h2>
            <p className="text-muted-foreground mt-1">
              {completedTasks}/{totalTasks} tehtävää valmis • {Math.round(completionPercentage)}% valmiina
            </p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                <Plus className="h-4 w-4 mr-2" />
                Uusi tehtävä
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Lisää uusi tehtävä</DialogTitle>
                <DialogDescription>
                  Luo uusi tehtävä häävalmisteluihin.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="task-title">Tehtävän nimi</Label>
                  <Input
                    id="task-title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Esim. Tilaa kukkakimput"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="task-description">Kuvaus</Label>
                  <Textarea
                    id="task-description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Tehtävän yksityiskohdat..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="task-dueDate">Määräaika</Label>
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
                  <div className="space-y-2">
                    <Label htmlFor="task-priority">Prioriteetti</Label>
                    <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Valitse prioriteetti" />
                      </SelectTrigger>
                      <SelectContent>
                        {priorityOptions.map((priority) => (
                          <SelectItem key={priority.value} value={priority.value}>
                            <div className="flex items-center gap-2">
                              <priority.icon className="h-4 w-4" />
                              {priority.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="task-assignedTo">Vastuuhenkilö</Label>
                  <Select value={formData.assignedTo} onValueChange={(value) => setFormData({...formData, assignedTo: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Valitse vastuuhenkilö" />
                    </SelectTrigger>
                    <SelectContent>
                      {assigneeOptions.map((assignee) => (
                        <SelectItem key={assignee.value} value={assignee.value}>
                          {assignee.label}
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
                <Button onClick={handleAddTask} className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                  Lisää tehtävä
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Progress Bar */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Kokonaisedistyminen</span>
            <span className="text-sm font-bold">{Math.round(completionPercentage)}%</span>
          </div>
          <Progress value={completionPercentage} className="h-3" />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>{tasks.filter(t => t.status === "odottaa").length} odottaa</span>
            <span>{tasks.filter(t => t.status === "kesken").length} kesken</span>
            <span>{completedTasks} valmis</span>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Hae tehtäviä..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Prioriteetti" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kaikki">Kaikki prioriteetit</SelectItem>
              {priorityOptions.map((priority) => (
                <SelectItem key={priority.value} value={priority.value}>
                  <div className="flex items-center gap-2">
                    <priority.icon className="h-4 w-4" />
                    {priority.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {statusColumns.map((column) => {
          const ColumnIcon = column.icon;
          const columnTasks = tasksByStatus[column.value] || [];
          
          return (
            <div key={column.value} className={`${column.color} rounded-xl p-4 min-h-[400px]`}>
              {/* Column Header */}
              <div className={`${column.headerColor} -m-4 mb-4 p-4 rounded-t-xl border-b`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ColumnIcon className="h-5 w-5" />
                    <h3 className="font-semibold">{column.label}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {columnTasks.length}
                    </Badge>
                  </div>
                  {column.value === "odottaa" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsAddDialogOpen(true)}
                      className="h-6 w-6 p-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{column.description}</p>
              </div>

              {/* Tasks */}
              <div className="space-y-3">
                {columnTasks.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <ColumnIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Ei tehtäviä</p>
                  </div>
                ) : (
                  columnTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Muokkaa tehtävää</DialogTitle>
            <DialogDescription>
              Muokkaa tehtävän tietoja.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Tehtävän nimi</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Kuvaus</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-dueDate">Määräaika</Label>
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
              <div className="space-y-2">
                <Label htmlFor="edit-priority">Prioriteetti</Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Valitse prioriteetti" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        <div className="flex items-center gap-2">
                          <priority.icon className="h-4 w-4" />
                          {priority.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-assignedTo">Vastuuhenkilö</Label>
                <Select value={formData.assignedTo} onValueChange={(value) => setFormData({...formData, assignedTo: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Valitse vastuuhenkilö" />
                  </SelectTrigger>
                  <SelectContent>
                    {assigneeOptions.map((assignee) => (
                      <SelectItem key={assignee.value} value={assignee.value}>
                        {assignee.label}
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
                    {statusColumns.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        <div className="flex items-center gap-2">
                          <status.icon className="h-4 w-4" />
                          {status.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingTask(null)}>
              Peruuta
            </Button>
            <Button onClick={handleUpdateTask}>
              Tallenna muutokset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
