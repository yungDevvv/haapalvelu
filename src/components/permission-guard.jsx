"use client";

import { useUser } from "@/contexts/user-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, AlertCircle } from "lucide-react";

export function PermissionGuard({ permission, children, fallback = null, showMessage = true }) {
  const { hasPermission, currentUser } = useUser();

  if (hasPermission(permission)) {
    return children;
  }

  if (fallback) {
    return fallback;
  }

  if (!showMessage) {
    return null;
  }

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-orange-600" />
          <CardTitle className="text-orange-800">Ei käyttöoikeutta</CardTitle>
        </div>
        <CardDescription className="text-orange-700">
          Tämä toiminto ei ole käytettävissä roolillesi "{currentUser.role.name}".
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <span className="text-sm text-orange-700">
            Tarvitset korkeammat käyttöoikeudet tämän sisällön katseluun.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export function RoleBasedTabs({ tabs, currentTab, onTabChange }) {
  const { hasPermission } = useUser();

  const availableTabs = tabs.filter(tab => 
    !tab.permission || hasPermission(tab.permission)
  );

  return (
    <div className="flex flex-wrap gap-1">
      {availableTabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onTabChange(tab.value)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            currentTab === tab.value
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {tab.icon}
            {tab.label}
          </div>
        </button>
      ))}
    </div>
  );
}
