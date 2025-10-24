"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DatePicker } from "@/components/ui/date-picker";
import { Plus, MoreVertical, Edit, Trash2, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Receipt, ChevronDown, ChevronUp, Sparkles, FolderOpen } from "lucide-react";

export function BudgetManager({ budget: initialBudget, expenses: initialExpenses }) {
  const [budget, setBudget] = useState(initialBudget);
  const [expenses, setExpenses] = useState(initialExpenses || []);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [errors, setErrors] = useState({});

  // Form states
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    budgeted: "",
    description: ""
  });

  const [expenseForm, setExpenseForm] = useState({
    category: "",
    description: "",
    estimatedPrice: "",
    confirmedPrice: "",
    date: new Date().toISOString().split('T')[0],
    vendor: "",
    notes: "",
    isPaid: false
  });

  // Soft, muted colors instead of 100% saturated colors
  const categoryColors = [
    { value: "blue", label: "Sininen", class: "bg-blue-400", dotClass: "bg-blue-500", lightClass: "bg-blue-50/50", borderClass: "border-blue-100" },
    { value: "green", label: "Vihreä", class: "bg-green-400", dotClass: "bg-green-500", lightClass: "bg-green-50/50", borderClass: "border-green-100" },
    { value: "purple", label: "Violetti", class: "bg-purple-400", dotClass: "bg-purple-500", lightClass: "bg-purple-50/50", borderClass: "border-purple-100" },
    { value: "red", label: "Punainen", class: "bg-red-400", dotClass: "bg-red-500", lightClass: "bg-red-50/50", borderClass: "border-red-100" },
    { value: "orange", label: "Oranssi", class: "bg-orange-400", dotClass: "bg-orange-500", lightClass: "bg-orange-50/50", borderClass: "border-orange-100" },
    { value: "pink", label: "Vaaleanpunainen", class: "bg-pink-400", dotClass: "bg-pink-500", lightClass: "bg-pink-50/50", borderClass: "border-pink-100" },
    { value: "indigo", label: "Indigo", class: "bg-indigo-400", dotClass: "bg-indigo-500", lightClass: "bg-indigo-50/50", borderClass: "border-indigo-100" },
    { value: "yellow", label: "Keltainen", class: "bg-yellow-400", dotClass: "bg-yellow-500", lightClass: "bg-yellow-50/50", borderClass: "border-yellow-100" }
  ];

  const resetCategoryForm = () => {
    setCategoryForm({ name: "", budgeted: "", description: "" });
    setErrors({});
  };

  const resetExpenseForm = () => {
    setExpenseForm({
      category: "",
      description: "",
      estimatedPrice: "",
      confirmedPrice: "",
      date: new Date().toISOString().split('T')[0],
      vendor: "",
      notes: "",
      isPaid: false
    });
    setErrors({});
  };

  // Validation functions
  const validateCategoryForm = () => {
    const newErrors = {};
    if (!categoryForm.name.trim()) {
      newErrors.name = "Nimi on pakollinen";
    }
    if (!categoryForm.budgeted || parseFloat(categoryForm.budgeted) <= 0) {
      newErrors.budgeted = "Budjetti on oltava suurempi kuin 0";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateExpenseForm = () => {
    const newErrors = {};
    if (!expenseForm.category) {
      newErrors.category = "Valitse kategoria";
    }
    if (!expenseForm.description.trim()) {
      newErrors.description = "Kuvaus on pakollinen";
    }
    const estimated = parseFloat(expenseForm.estimatedPrice);
    const confirmed = parseFloat(expenseForm.confirmedPrice);
    
    if (!expenseForm.estimatedPrice && !expenseForm.confirmedPrice) {
      newErrors.price = "Syötä vähintään arvioitu tai vahvistettu hinta";
    }
    if (expenseForm.estimatedPrice && (isNaN(estimated) || estimated <= 0)) {
      newErrors.estimatedPrice = "Hinnan on oltava suurempi kuin 0";
    }
    if (expenseForm.confirmedPrice && (isNaN(confirmed) || confirmed <= 0)) {
      newErrors.confirmedPrice = "Hinnan on oltava suurempi kuin 0";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddCategory = () => {
    if (!validateCategoryForm()) return;
    
    // Auto-assign color based on index
    const colorIndex = budget.categories.length % categoryColors.length;
    const assignedColor = categoryColors[colorIndex].value;
    
    const newCategory = {
      name: categoryForm.name,
      budgeted: parseFloat(categoryForm.budgeted),
      spent: 0,
      remaining: parseFloat(categoryForm.budgeted),
      description: categoryForm.description,
      color: assignedColor
    };
    
    setBudget(prev => ({
      ...prev,
      categories: [...prev.categories, newCategory]
    }));
    
    setIsAddCategoryOpen(false);
    resetCategoryForm();
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      budgeted: category.budgeted.toString(),
      description: category.description || ""
    });
  };

  const handleUpdateCategory = () => {
    if (!validateCategoryForm()) return;

    setBudget(prev => ({
      ...prev,
      categories: prev.categories.map(cat => 
        cat.name === editingCategory.name 
          ? {
              ...cat,
              name: categoryForm.name,
              budgeted: parseFloat(categoryForm.budgeted),
              remaining: parseFloat(categoryForm.budgeted) - cat.spent,
              description: categoryForm.description
            }
          : cat
      )
    }));
    setEditingCategory(null);
    resetCategoryForm();
  };

  const confirmDeleteCategory = (categoryName) => {
    const categoryExpenses = expenses.filter(exp => exp.category === categoryName);
    setCategoryToDelete({ name: categoryName, expensesCount: categoryExpenses.length });
    setDeleteDialogOpen(true);
  };

  const handleDeleteCategory = () => {
    if (categoryToDelete) {
      setBudget(prev => ({
        ...prev,
        categories: prev.categories.filter(cat => cat.name !== categoryToDelete.name)
      }));
      // Remove expenses for this category
      setExpenses(prev => prev.filter(exp => exp.category !== categoryToDelete.name));
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleAddExpense = () => {
    if (!validateExpenseForm()) return;

    // Use confirmed price if available, otherwise use estimated price
    const finalAmount = expenseForm.confirmedPrice 
      ? parseFloat(expenseForm.confirmedPrice) 
      : parseFloat(expenseForm.estimatedPrice);

    const newExpense = {
      id: expenses.length > 0 ? Math.max(...expenses.map(e => e.id || 0)) + 1 : 1,
      category: expenseForm.category,
      description: expenseForm.description,
      amount: finalAmount,
      estimatedPrice: expenseForm.estimatedPrice ? parseFloat(expenseForm.estimatedPrice) : null,
      confirmedPrice: expenseForm.confirmedPrice ? parseFloat(expenseForm.confirmedPrice) : null,
      date: expenseForm.date,
      vendor: expenseForm.vendor,
      notes: expenseForm.notes,
      isPaid: expenseForm.isPaid
    };
    
    setExpenses(prev => [...prev, newExpense]);
    
    // Update category spent amount
    setBudget(prev => ({
      ...prev,
      categories: prev.categories.map(cat => 
        cat.name === expenseForm.category 
          ? {
              ...cat,
              spent: cat.spent + finalAmount,
              remaining: cat.budgeted - (cat.spent + finalAmount)
            }
          : cat
      )
    }));
    
    setIsAddExpenseOpen(false);
    resetExpenseForm();
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setExpenseForm({
      category: expense.category,
      description: expense.description,
      estimatedPrice: expense.estimatedPrice?.toString() || "",
      confirmedPrice: expense.confirmedPrice?.toString() || "",
      date: expense.date,
      vendor: expense.vendor || "",
      notes: expense.notes || "",
      isPaid: expense.isPaid || false
    });
  };

  const handleUpdateExpense = () => {
    if (!validateExpenseForm()) return;

    const oldExpense = expenses.find(e => e.id === editingExpense.id);
    
    // Calculate new amount
    const newAmount = expenseForm.confirmedPrice 
      ? parseFloat(expenseForm.confirmedPrice) 
      : parseFloat(expenseForm.estimatedPrice);

    const updatedExpense = {
      ...editingExpense,
      category: expenseForm.category,
      description: expenseForm.description,
      amount: newAmount,
      estimatedPrice: expenseForm.estimatedPrice ? parseFloat(expenseForm.estimatedPrice) : null,
      confirmedPrice: expenseForm.confirmedPrice ? parseFloat(expenseForm.confirmedPrice) : null,
      date: expenseForm.date,
      vendor: expenseForm.vendor,
      notes: expenseForm.notes,
      isPaid: expenseForm.isPaid
    };

    setExpenses(prev => prev.map(e => e.id === editingExpense.id ? updatedExpense : e));

    // Update category spent amount
    const amountDiff = newAmount - oldExpense.amount;
    setBudget(prev => ({
      ...prev,
      categories: prev.categories.map(cat => {
        if (cat.name === oldExpense.category && oldExpense.category === updatedExpense.category) {
          return {
            ...cat,
            spent: cat.spent + amountDiff,
            remaining: cat.remaining - amountDiff
          };
        } else if (cat.name === oldExpense.category) {
          return {
            ...cat,
            spent: cat.spent - oldExpense.amount,
            remaining: cat.remaining + oldExpense.amount
          };
        } else if (cat.name === updatedExpense.category) {
          return {
            ...cat,
            spent: cat.spent + newAmount,
            remaining: cat.remaining - newAmount
          };
        }
        return cat;
      })
    }));

    setEditingExpense(null);
    resetExpenseForm();
  };

  const handleDeleteExpense = (expenseId) => {
    const expense = expenses.find(e => e.id === expenseId);
    if (expense) {
      // Update category spent amount
      setBudget(prev => ({
        ...prev,
        categories: prev.categories.map(cat => 
          cat.name === expense.category 
            ? {
                ...cat,
                spent: cat.spent - expense.amount,
                remaining: cat.remaining + expense.amount
              }
            : cat
        )
      }));
      
      setExpenses(prev => prev.filter(e => e.id !== expenseId));
    }
  };

  // Calculate totals
  const totalBudgeted = budget.categories.reduce((sum, cat) => sum + cat.budgeted, 0);
  const totalSpent = budget.categories.reduce((sum, cat) => sum + cat.spent, 0);
  const totalRemaining = totalBudgeted - totalSpent;
  const spentPercentage = totalBudgeted > 0 ? Math.min((totalSpent / totalBudgeted) * 100, 100) : 0;

  const getColorClasses = (color) => {
    const colorObj = categoryColors.find(c => c.value === color) || categoryColors[0];
    return colorObj;
  };

  const toggleCategory = (categoryName) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };

  const getCategoryExpenses = (categoryName) => {
    return expenses.filter(exp => exp.category === categoryName).sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  // Calculate estimated and confirmed totals for category
  const getCategoryTotals = (categoryName) => {
    const categoryExpenses = expenses.filter(exp => exp.category === categoryName);
    const estimated = categoryExpenses.reduce((sum, exp) => sum + (exp.estimatedPrice || 0), 0);
    const confirmed = categoryExpenses.reduce((sum, exp) => sum + (exp.confirmedPrice || 0), 0);
    return { estimated, confirmed };
  };

  // Calculate total estimated and confirmed across all categories
  const totalEstimated = expenses.reduce((sum, exp) => sum + (exp.estimatedPrice || 0), 0);
  const totalConfirmed = expenses.reduce((sum, exp) => sum + (exp.confirmedPrice || 0), 0);

  const handleResetAll = () => {
    setResetDialogOpen(true);
  };

  const confirmResetAll = () => {
    setBudget({
      ...initialBudget,
      categories: []
    });
    setExpenses([]);
    setExpandedCategories({});
    setResetDialogOpen(false);
  };

  // Empty state
  if (budget.categories.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Budjetti
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16 px-4"
        >
          <div className="rounded-full bg-gradient-to-br from-pink-100 to-purple-100 p-6 mb-6">
            <FolderOpen className="h-16 w-16 text-pink-500" />
          </div>
          <h3 className="text-2xl font-semibold mb-2">Aloita budjetin suunnittelu</h3>
          <p className="text-muted-foreground text-center mb-6 max-w-md">
            Luo ensimmäinen budjettikategoria ja aloita hääbudjetin hallinta.
          </p>
          
          <Dialog open={isAddCategoryOpen} onOpenChange={(open) => {
            setIsAddCategoryOpen(open);
            if (!open) resetCategoryForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white shadow-lg">
                <Plus className="h-5 w-5 mr-2" />
                Luo ensimmäinen kategoria
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Lisää budjettikategoria</DialogTitle>
                <DialogDescription>
                  Luo uusi kategoria budjettisi hallintaan.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="category-name">Kategorian nimi</Label>
                  <Input
                    id="category-name"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                    placeholder="Esim. Kukat ja koristeet"
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category-budget">Budjetti (€) *</Label>
                  <Input
                    id="category-budget"
                    type="number"
                    step="0.01"
                    min="0"
                    value={categoryForm.budgeted}
                    onChange={(e) => setCategoryForm({...categoryForm, budgeted: e.target.value})}
                    placeholder="0.00"
                    className={errors.budgeted ? "border-red-500" : ""}
                  />
                  {errors.budgeted && <p className="text-sm text-red-500">{errors.budgeted}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category-description">Kuvaus</Label>
                  <Textarea
                    id="category-description"
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                    placeholder="Mitä tähän kategoriaan kuuluu..."
                    rows={2}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddCategoryOpen(false)}>
                  Peruuta
                </Button>
                <Button onClick={handleAddCategory} className="bg-pink-500 hover:bg-pink-600 text-white">
                  Lisää kategoria
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with totals */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Budjetti
            </h2>
            <p className="text-muted-foreground mt-1">
              {totalSpent.toLocaleString('fi-FI')} € / {totalBudgeted.toLocaleString('fi-FI')} € käytetty
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Dialog open={isAddExpenseOpen} onOpenChange={(open) => {
              setIsAddExpenseOpen(open);
              if (!open) resetExpenseForm();
            }}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Receipt className="h-4 w-4 mr-2" />
                  Lisää kulu
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Lisää uusi kulu</DialogTitle>
                  <DialogDescription>
                    Kirjaa uusi kulu budjettikategoriaan.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="expense-category">Kategoria *</Label>
                    <Select value={expenseForm.category} onValueChange={(value) => setExpenseForm({...expenseForm, category: value})}>
                      <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                        <SelectValue placeholder="Valitse kategoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {budget.categories.map((category) => (
                          <SelectItem key={category.name} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expense-date">Päivämäärä</Label>
                    <DatePicker
                      date={expenseForm.date ? new Date(expenseForm.date) : undefined}
                      onDateChange={(selectedDate) => {
                        if (selectedDate) {
                          setExpenseForm({...expenseForm, date: selectedDate.toISOString().split('T')[0]});
                        }
                      }}
                      placeholder="Valitse päivämäärä"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expense-description">Kuvaus *</Label>
                    <Input
                      id="expense-description"
                      value={expenseForm.description}
                      onChange={(e) => setExpenseForm({...expenseForm, description: e.target.value})}
                      placeholder="Esim. Kukkakimput"
                      className={errors.description ? "border-red-500" : ""}
                    />
                    {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expense-vendor">Toimittaja</Label>
                    <Input
                      id="expense-vendor"
                      value={expenseForm.vendor}
                      onChange={(e) => setExpenseForm({...expenseForm, vendor: e.target.value})}
                      placeholder="Esim. Kukkakauppa Ruusu"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Syötä joko arvioitu tai vahvistettu hinta *</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expense-estimated">Arvioitu hinta (€)</Label>
                        <Input
                          id="expense-estimated"
                          type="number"
                          step="0.01"
                          min="0"
                          value={expenseForm.estimatedPrice}
                          onChange={(e) => setExpenseForm({...expenseForm, estimatedPrice: e.target.value})}
                          placeholder="0.00"
                          className={errors.estimatedPrice ? "border-red-500" : ""}
                        />
                        {errors.estimatedPrice && <p className="text-sm text-red-500">{errors.estimatedPrice}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="expense-confirmed">Vahvistettu hinta (€)</Label>
                        <Input
                          id="expense-confirmed"
                          type="number"
                          step="0.01"
                          min="0"
                          value={expenseForm.confirmedPrice}
                          onChange={(e) => setExpenseForm({...expenseForm, confirmedPrice: e.target.value})}
                          placeholder="0.00"
                          className={errors.confirmedPrice ? "border-red-500" : ""}
                        />
                        {errors.confirmedPrice && <p className="text-sm text-red-500">{errors.confirmedPrice}</p>}
                      </div>
                    </div>
                    {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expense-notes">Muistiinpanot</Label>
                    <Textarea
                      id="expense-notes"
                      value={expenseForm.notes}
                      onChange={(e) => setExpenseForm({...expenseForm, notes: e.target.value})}
                      placeholder="Lisätietoja..."
                      rows={2}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddExpenseOpen(false)}>
                    Peruuta
                  </Button>
                  <Button onClick={handleAddExpense} className="bg-pink-500 hover:bg-pink-600 text-white">
                    Lisää kulu
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button
              variant="outline"
              onClick={handleResetAll}
              className="border-red-200 hover:bg-red-50 text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Aloita alusta
            </Button>

            <Dialog open={isAddCategoryOpen} onOpenChange={(open) => {
              setIsAddCategoryOpen(open);
              if (!open) resetCategoryForm();
            }}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white shadow-md">
                  <Plus className="h-4 w-4 mr-2" />
                  Uusi kategoria
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Lisää budjettikategoria</DialogTitle>
                  <DialogDescription>
                    Luo uusi kategoria budjettisi hallintaan.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="category-name">Kategorian nimi *</Label>
                    <Input
                      id="category-name"
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                      placeholder="Esim. Kukat ja koristeet"
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category-budget">Budjetti (€) *</Label>
                    <Input
                      id="category-budget"
                      type="number"
                      step="0.01"
                      min="0"
                      value={categoryForm.budgeted}
                      onChange={(e) => setCategoryForm({...categoryForm, budgeted: e.target.value})}
                      placeholder="0.00"
                      className={errors.budgeted ? "border-red-500" : ""}
                    />
                    {errors.budgeted && <p className="text-sm text-red-500">{errors.budgeted}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category-description">Kuvaus</Label>
                    <Textarea
                      id="category-description"
                      value={categoryForm.description}
                      onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                      placeholder="Mitä tähän kategoriaan kuuluu..."
                      rows={2}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddCategoryOpen(false)}>
                    Peruuta
                  </Button>
                  <Button onClick={handleAddCategory} className="bg-pink-500 hover:bg-pink-600 text-white">
                    Lisää kategoria
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Overall Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gray-50/50 border border-gray-200">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-gray-900">
                  Kokonaisbudjetti
                </CardTitle>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-0.5">Arvioitu hinta</p>
                  <p className="text-base font-semibold text-gray-900">{totalEstimated.toLocaleString('fi-FI')} €</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-0.5">Vahvistettu hinta</p>
                  <p className="text-base font-semibold text-gray-900">{totalConfirmed.toLocaleString('fi-FI')} €</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-0.5">Budjetoitu</p>
                  <p className="text-base font-semibold text-gray-900">{totalBudgeted.toLocaleString('fi-FI')} €</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-0.5">Jäljellä</p>
                  <p className={`text-base font-semibold ${totalRemaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {totalRemaining.toLocaleString('fi-FI')} €
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gray-800 transition-all duration-300"
                style={{ width: `${Math.min(spentPercentage, 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-500">0%</span>
              <span className="text-xs font-medium text-gray-700">{Math.round(spentPercentage)}% käytetty</span>
              <span className="text-xs text-gray-500">100%</span>
            </div>
          </CardContent>
        </Card>
        </motion.div>
      </div>

      {/* Budget Categories - Collapsible */}
      <div className="space-y-3">
        <AnimatePresence>
          {budget.categories.map((category, index) => {
            const categoryTotals = getCategoryTotals(category.name);
            const percentage = category.budgeted > 0 ? (category.spent / category.budgeted) * 100 : 0;
            const isOverBudget = category.spent > category.budgeted;
            const isExpanded = expandedCategories[category.name];
            const categoryExpenses = getCategoryExpenses(category.name);
            const colorClasses = getColorClasses(category.color);
            
            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`border ${colorClasses.borderClass} hover:shadow-md transition-shadow duration-200 bg-white`}>
              <CardHeader 
                className="pb-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
                onClick={() => toggleCategory(category.name)}
              >
                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`w-2 h-2 rounded-full ${colorClasses.dotClass} flex-shrink-0`}></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col gap-0.5">
                        <CardTitle className="text-base font-semibold truncate text-gray-900">{category.name}</CardTitle>
                        {category.description && (
                          <CardDescription className="text-xs truncate text-gray-500">{category.description}</CardDescription>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="hidden lg:flex items-center gap-2">
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1.5">Edistyminen</p>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-300 ${isOverBudget ? 'bg-red-400' : 'bg-gray-800'}`}
                              style={{ width: `${Math.min(percentage, 100)}%` }}
                            />
                          </div>
                          <span className={`text-xs font-medium min-w-[40px] text-right ${isOverBudget ? 'text-red-600' : 'text-gray-700'}`}>
                            {Math.round(percentage)}%
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-0.5">Arvioitu</p>
                      <p className="text-sm font-semibold whitespace-nowrap text-gray-900">
                        {categoryTotals.estimated.toLocaleString('fi-FI')} €
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-0.5">Vahvistettu</p>
                      <p className="text-sm font-semibold whitespace-nowrap text-gray-900">
                        {categoryTotals.confirmed.toLocaleString('fi-FI')} €
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-0.5">Budjetti</p>
                      <p className="text-sm font-semibold whitespace-nowrap text-gray-900">{category.budgeted.toLocaleString('fi-FI')} €</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-0.5">Jäljellä</p>
                      <p className={`text-sm font-semibold whitespace-nowrap ${category.remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {category.remaining.toLocaleString('fi-FI')} €
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-0.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpenseForm({...expenseForm, category: category.name});
                          setIsAddExpenseOpen(true);
                        }}
                        className="h-8 w-8 p-0 hover:bg-gray-100"
                      >
                        <Plus className="h-4 w-4 text-gray-600" />
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                            <MoreVertical className="h-4 w-4 text-gray-600" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditCategory(category)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Muokkaa
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => confirmDeleteCategory(category.name)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Poista
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-gray-400 ml-0.5" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-400 ml-0.5" />
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              {isExpanded && (
                <CardContent className="pt-0">
                  <div className="space-y-1.5">
                    {categoryExpenses.length > 0 ? (
                      categoryExpenses.map((expense) => (
                        <div key={expense.id} className="flex items-center justify-between p-2.5 hover:bg-gray-50 rounded-md transition-colors">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-gray-900 truncate">{expense.description}</p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {expense.vendor} • {new Date(expense.date).toLocaleDateString('fi-FI')}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <div className="flex flex-col items-end gap-0.5">
                              {expense.estimatedPrice && (
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs text-gray-500">Arvioitu:</span>
                                  <span className="font-medium text-sm text-gray-700">{expense.estimatedPrice.toLocaleString('fi-FI')} €</span>
                                </div>
                              )}
                              {expense.confirmedPrice && (
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs text-gray-500">Vahvistettu:</span>
                                  <span className="font-semibold text-sm text-gray-900">{expense.confirmedPrice.toLocaleString('fi-FI')} €</span>
                                </div>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditExpense(expense)}
                              className="h-7 w-7 p-0 hover:bg-blue-50"
                            >
                              <Edit className="h-3.5 w-3.5 text-gray-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteExpense(expense.id)}
                              className="h-7 w-7 p-0 hover:bg-red-50"
                            >
                              <Trash2 className="h-3.5 w-3.5 text-gray-600" />
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground py-2">Ei kuluja tässä kategoriassa</p>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Recent Expenses */}
      {expenses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Viimeisimmät kulut
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expenses.slice(-5).reverse().map((expense) => {
                const category = budget.categories.find(cat => cat.name === expense.category);
                return (
                  <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{expense.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {expense.category} • {expense.vendor} • {new Date(expense.date).toLocaleDateString('fi-FI')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{expense.amount.toLocaleString('fi-FI')} €</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Category Dialog */}
      <Dialog open={!!editingCategory} onOpenChange={(open) => {
        if (!open) {
          setEditingCategory(null);
          resetCategoryForm();
        }
      }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Muokkaa kategoriaa</DialogTitle>
            <DialogDescription>
              Muokkaa kategorian tietoja.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-category-name">Kategorian nimi *</Label>
              <Input
                id="edit-category-name"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category-budget">Budjetti (€) *</Label>
              <Input
                id="edit-category-budget"
                type="number"
                step="0.01"
                min="0"
                value={categoryForm.budgeted}
                onChange={(e) => setCategoryForm({...categoryForm, budgeted: e.target.value})}
                className={errors.budgeted ? "border-red-500" : ""}
              />
              {errors.budgeted && <p className="text-sm text-red-500">{errors.budgeted}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category-description">Kuvaus</Label>
              <Textarea
                id="edit-category-description"
                value={categoryForm.description}
                onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingCategory(null)}>
              Peruuta
            </Button>
            <Button onClick={handleUpdateCategory} className="bg-pink-500 hover:bg-pink-600 text-white">
              Tallenna muutokset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Expense Dialog */}
      <Dialog open={!!editingExpense} onOpenChange={(open) => {
        if (!open) {
          setEditingExpense(null);
          resetExpenseForm();
        }
      }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Muokkaa kulua</DialogTitle>
            <DialogDescription>
              Muokkaa kulun tietoja.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-expense-category">Kategoria *</Label>
              <Select value={expenseForm.category} onValueChange={(value) => setExpenseForm({...expenseForm, category: value})}>
                <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                  <SelectValue placeholder="Valitse kategoria" />
                </SelectTrigger>
                <SelectContent>
                  {budget.categories.map((category) => (
                    <SelectItem key={category.name} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-expense-date">Päivämäärä</Label>
              <DatePicker
                date={expenseForm.date ? new Date(expenseForm.date) : undefined}
                onDateChange={(selectedDate) => {
                  if (selectedDate) {
                    setExpenseForm({...expenseForm, date: selectedDate.toISOString().split('T')[0]});
                  }
                }}
                placeholder="Valitse päivämäärä"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-expense-description">Kuvaus *</Label>
              <Input
                id="edit-expense-description"
                value={expenseForm.description}
                onChange={(e) => setExpenseForm({...expenseForm, description: e.target.value})}
                placeholder="Esim. Kukkakimput"
                className={errors.description ? "border-red-500" : ""}
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-expense-vendor">Toimittaja</Label>
              <Input
                id="edit-expense-vendor"
                value={expenseForm.vendor}
                onChange={(e) => setExpenseForm({...expenseForm, vendor: e.target.value})}
                placeholder="Esim. Kukkakauppa Ruusu"
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Syötä joko arvioitu tai vahvistettu hinta *</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-expense-estimated">Arvioitu hinta (€)</Label>
                  <Input
                    id="edit-expense-estimated"
                    type="number"
                    step="0.01"
                    min="0"
                    value={expenseForm.estimatedPrice}
                    onChange={(e) => setExpenseForm({...expenseForm, estimatedPrice: e.target.value})}
                    placeholder="0.00"
                    className={errors.estimatedPrice ? "border-red-500" : ""}
                  />
                  {errors.estimatedPrice && <p className="text-sm text-red-500">{errors.estimatedPrice}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-expense-confirmed">Vahvistettu hinta (€)</Label>
                  <Input
                    id="edit-expense-confirmed"
                    type="number"
                    step="0.01"
                    min="0"
                    value={expenseForm.confirmedPrice}
                    onChange={(e) => setExpenseForm({...expenseForm, confirmedPrice: e.target.value})}
                    placeholder="0.00"
                    className={errors.confirmedPrice ? "border-red-500" : ""}
                  />
                  {errors.confirmedPrice && <p className="text-sm text-red-500">{errors.confirmedPrice}</p>}
                </div>
              </div>
              {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-expense-notes">Muistiinpanot</Label>
              <Textarea
                id="edit-expense-notes"
                value={expenseForm.notes}
                onChange={(e) => setExpenseForm({...expenseForm, notes: e.target.value})}
                placeholder="Lisätietoja..."
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingExpense(null)}>
              Peruuta
            </Button>
            <Button onClick={handleUpdateExpense} className="bg-pink-500 hover:bg-pink-600 text-white">
              Tallenna muutokset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Category Alert Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Poista kategoria?</AlertDialogTitle>
            <AlertDialogDescription>
              Oletko varma, että haluat poistaa kategorian "{categoryToDelete?.name}"?
              {categoryToDelete?.expensesCount > 0 && (
                <span className="block mt-2 text-red-600 font-semibold">
                  Tämä poistaa myös {categoryToDelete.expensesCount} kulua tästä kategoriasta.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>Peruuta</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCategory} className="bg-red-600 hover:bg-red-700">
              Poista kategoria
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reset All Alert Dialog */}
      <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Aloita alusta?</AlertDialogTitle>
            <AlertDialogDescription>
              Oletko varma, että haluat aloittaa alusta? Kaikki kategoriat ja kulut poistetaan pysyvästi.
              <span className="block mt-2 font-semibold">
                Tätä toimintoa ei voi perua.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setResetDialogOpen(false)}>Peruuta</AlertDialogCancel>
            <AlertDialogAction onClick={confirmResetAll} className="bg-red-600 hover:bg-red-700">
              Aloita alusta
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
