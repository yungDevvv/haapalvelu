"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Calendar, Users, Camera, Heart, CheckCircle, Clock, MapPin, FileText, Euro, Pin, AlertTriangle, Target, Zap, Globe } from "lucide-react";
import { fadeInUp, staggerContainer, staggerItem, hoverScale, hoverLift } from "@/lib/animations";
import { weddingCouple, vieraskortti, participants, weddingProgram, photoGalleries, weddingTasks, weddingNotes, weddingBudget, weddingExpenses } from "@/lib/mock-data";
import { ParticipantsManager } from "@/components/participants-manager";
import { HaasivutList } from "@/components/haasivut-list";
import { PhotoGallery } from "@/components/photo-gallery";
import { TasksManagerImproved } from "@/components/tasks-manager-improved";
import { NotesManager } from "@/components/notes-manager";
import { BudgetManager } from "@/components/budget-manager";
import { UserProvider, useUser } from "@/contexts/user-context";
import { RoleSwitcher } from "@/components/role-switcher";
import { PermissionGuard } from "@/components/permission-guard";

function HomeContent() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { hasPermission } = useUser();

  // Calculate statistics for dashboard
  const totalParticipants = participants.length;
  const confirmedParticipants = participants.filter(p => p.confirmed).length;
  const completedTasks = weddingTasks.filter(t => t.status === "valmis").length;
  const totalPhotos = photoGalleries.reduce((sum, gallery) => sum + gallery.photos.length, 0);
  const totalBudgetSpent = weddingBudget.categories.reduce((sum, cat) => sum + cat.spent, 0);
  const budgetPercentage = (totalBudgetSpent / weddingBudget.totalBudget) * 100;

  // Get pinned items
  const pinnedTasks = weddingTasks.filter(task => task.pinned && task.status !== "valmis");
  const pinnedNotes = weddingNotes.filter(note => note.pinned);

  // Priority icons
  const priorityIcons = {
    matala: Target,
    keskitaso: Zap,
    korkea: AlertTriangle
  };

  const priorityColors = {
    matala: "text-green-600 bg-green-100",
    keskitaso: "text-blue-600 bg-blue-100",
    korkea: "text-red-600 bg-red-100"
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Available tabs based on user permissions
  const availableTabs = [
    { value: "dashboard", label: "Etusivu", icon: <Heart className="h-4 w-4" />, permission: "viewDashboard" },
    { value: "participants", label: "Vieraat", icon: <Users className="h-4 w-4" />, permission: "manageParticipants" },
    { value: "program", label: "Hääsivu", icon: <Globe className="h-4 w-4" />, permission: "editProgram" },
    { value: "photos", label: "Galleria", icon: <Camera className="h-4 w-4" />, permission: "managePhotos" },
    { value: "tasks", label: "Tehtävät", icon: <CheckCircle className="h-4 w-4" />, permission: "manageTasks" },
    { value: "notes", label: "Muistiinpanot", icon: <FileText className="h-4 w-4" />, permission: "manageNotes" },
    { value: "budget", label: "Budjetti", icon: <Euro className="h-4 w-4" />, permission: "manageBudget" }
  ].filter(tab => hasPermission(tab.permission));

  // Set default tab to first available tab if current tab is not accessible
  const currentTab = availableTabs.find(tab => tab.value === activeTab) ? activeTab : availableTabs[0]?.value || "dashboard";

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <motion.header
        className="bg-white/80 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-50"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center gap-3"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Heart className="h-8 w-8 text-pink-500" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">Hääpalvelu</h1>
                <p className="text-sm text-gray-600">
                  {weddingCouple.bride.firstName} & {weddingCouple.groom.firstName} • {weddingCouple.weddingDate}
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <RoleSwitcher />
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={currentTab} onValueChange={setActiveTab} className="">
          <div className="w-full flex justify-center">
            <TabsList className="mb-8 w-fit px-4 gap-4">
              {availableTabs.map((tab) => (
                <TabsTrigger className="" key={tab.value} value={tab.value}>
                  {tab.icon}
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>


          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <PermissionGuard permission="viewDashboard">
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                <motion.div variants={staggerItem} whileHover={hoverLift}>
                  <Card className="transition-shadow hover:shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Vieraat</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{confirmedParticipants}/{totalParticipants}</div>
                      <p className="text-xs text-muted-foreground">vahvistettu</p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={staggerItem} whileHover={hoverLift}>
                  <Card className="transition-shadow hover:shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Tehtävät</CardTitle>
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{completedTasks}/{weddingTasks.length}</div>
                      <p className="text-xs text-muted-foreground">valmista</p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={staggerItem} whileHover={hoverLift}>
                  <Card className="transition-shadow hover:shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Kuvat</CardTitle>
                      <Camera className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{totalPhotos}</div>
                      <p className="text-xs text-muted-foreground">kuvaa ladattu</p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={staggerItem} whileHover={hoverLift}>
                  <Card className="transition-shadow hover:shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Budjetti</CardTitle>
                      <Euro className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{Math.round(budgetPercentage)}%</div>
                      <p className="text-xs text-muted-foreground">käytetty</p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={staggerItem} whileHover={hoverLift}>
                  <Card className="transition-shadow hover:shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Päiviä jäljellä</CardTitle>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {Math.ceil((new Date(weddingCouple.weddingDate) - new Date()) / (1000 * 60 * 60 * 24))}
                      </div>
                      <p className="text-xs text-muted-foreground">häihin</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>

              {/* Pinned Items Section */}
              {(pinnedTasks.length > 0 || pinnedNotes.length > 0) && (
                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <div className="flex items-center gap-2">
                    <Pin className="h-5 w-5 text-yellow-600" />
                    <h3 className="text-lg font-semibold">Kiinnitetyt</h3>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Pinned Tasks */}
                    {pinnedTasks.length > 0 && (
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            Tärkeät tehtävät
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {pinnedTasks.map((task) => {
                            const PriorityIcon = priorityIcons[task.priority];
                            const daysUntilDue = getDaysUntilDue(task.dueDate);

                            return (
                              <div key={task.id} className="p-3 bg-yellow-50/50 rounded-lg border border-yellow-200">
                                <div className="flex items-start justify-between mb-2">
                                  <h4 className="font-medium text-sm">{task.title}</h4>
                                  <Badge className={`${priorityColors[task.priority]} text-xs`}>
                                    <PriorityIcon className="h-3 w-3 mr-1" />
                                    {task.priority === 'matala' ? 'Matala' : task.priority === 'keskitaso' ? 'Keskitaso' : 'Korkea'}
                                  </Badge>
                                </div>
                                <p className="text-xs text-gray-600 mb-2 line-clamp-2">{task.description}</p>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                  <span>{task.assignedTo}</span>
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {daysUntilDue < 0 ? (
                                      <span className="text-red-600 font-medium">Myöhässä</span>
                                    ) : daysUntilDue === 0 ? (
                                      <span className="text-orange-600 font-medium">Tänään</span>
                                    ) : (
                                      <span>{daysUntilDue} päivää</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </CardContent>
                      </Card>
                    )}

                    {/* Pinned Notes */}
                    {pinnedNotes.length > 0 && (
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Tärkeät muistiinpanot
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {pinnedNotes.map((note) => (
                            <div key={note.id} className="p-3 bg-yellow-50/50 rounded-lg border border-yellow-200">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-medium text-sm">{note.title}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {note.category === 'muistilista' ? 'Muistilista' :
                                    note.category === 'puheet' ? 'Puheet' :
                                      note.category === 'ideat' ? 'Ideat' :
                                        note.category === 'yhteystiedot' ? 'Yhteystiedot' :
                                          note.category === 'budjetti' ? 'Budjetti' : 'Muu'}
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-600 line-clamp-3 whitespace-pre-line">{note.content}</p>
                              <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                                <span>{note.createdBy}</span>
                                <span>{new Date(note.lastModified).toLocaleDateString('fi-FI')}</span>
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Budget Overview and Recent Activity */}
              {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Budjettikatsaus</CardTitle>
                  <CardDescription>
                    {totalBudgetSpent.toLocaleString('fi-FI')} € / {weddingBudget.totalBudget.toLocaleString('fi-FI')} €
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {weddingBudget.categories.map((category, index) => {
                      const percentage = (category.spent / category.budgeted) * 100;
                      return (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{category.name}</span>
                            <span className="text-muted-foreground">
                              {category.spent.toLocaleString('fi-FI')} € / {category.budgeted.toLocaleString('fi-FI')} €
                            </span>
                          </div>
                          <Progress 
                            value={percentage} 
                            className={`h-2 ${percentage > 90 ? 'bg-red-100' : percentage > 75 ? 'bg-yellow-100' : 'bg-green-100'}`}
                          />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Viimeisimmät tapahtumat</CardTitle>
                  <CardDescription>Mitä on tapahtunut viime aikoina</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Liisa Mäkinen vahvisti osallistumisensa</p>
                        <p className="text-xs text-muted-foreground">2 tuntia sitten</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Uusia kuvia lisätty polttarigalleriaan</p>
                        <p className="text-xs text-muted-foreground">1 päivä sitten</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Tehtävä "Tilaa kukkakimput" merkitty valmiiksi</p>
                        <p className="text-xs text-muted-foreground">3 päivää sitten</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Hääohjelma päivitetty uudella aikataululla</p>
                        <p className="text-xs text-muted-foreground">4 päivää sitten</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Uusi muistiinpano "Hääpäivän aikataulu" luotu</p>
                        <p className="text-xs text-muted-foreground">5 päivää sitten</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div> */}
            </PermissionGuard>
          </TabsContent>

          {/* Participants Tab */}
          <TabsContent value="participants" className="space-y-6">
            <PermissionGuard permission="manageParticipants">
              <ParticipantsManager />
            </PermissionGuard>
          </TabsContent>

          {/* Program Tab - Hääsivu */}
          <TabsContent value="program" className="space-y-6">
            <PermissionGuard permission="editProgram">
              <HaasivutList />
            </PermissionGuard>
          </TabsContent>

          {/* Photos Tab */}
          <TabsContent value="photos" className="space-y-6">
            <PermissionGuard permission="managePhotos">
              <PhotoGallery galleries={photoGalleries} />
            </PermissionGuard>
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-6">
            <PermissionGuard permission="manageTasks">
              <TasksManagerImproved tasks={weddingTasks} participants={participants} />
            </PermissionGuard>
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent value="notes" className="space-y-6">
            <PermissionGuard permission="manageNotes">
              <NotesManager notes={weddingNotes} />
            </PermissionGuard>
          </TabsContent>

          {/* Budget Tab */}
          <TabsContent value="budget" className="space-y-6">
            <PermissionGuard permission="manageBudget">
              <BudgetManager budget={weddingBudget} expenses={weddingExpenses} />
            </PermissionGuard>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <UserProvider>
      <HomeContent />
    </UserProvider>
  );
}
