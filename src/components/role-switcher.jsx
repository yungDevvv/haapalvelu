"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useUser } from "@/contexts/user-context";
import { ChevronDown, Heart, Eye } from "lucide-react";

const roleIcons = {
  haapari: Heart,
  vieras: Eye
};

export function RoleSwitcher() {
  const { currentUser, switchRole, roles } = useUser();

  const getRoleIcon = (roleId) => {
    const Icon = roleIcons[roleId] || Heart;
    return <Icon className="h-4 w-4" />;
  };

  return (
    <div className="flex items-center gap-3">
      {/* Current User Info */}
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={currentUser.avatar} />
          <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
        </Avatar>
        <div className="hidden sm:block">
          <p className="text-sm font-medium">{currentUser.name}</p>
          <p className="text-xs text-muted-foreground">{currentUser.role.description}</p>
        </div>
      </div>

      {/* Role Switcher Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Badge className={`${currentUser.role.color} text-white border-0`}>
              {getRoleIcon(currentUser.role.id)}
              <span className="ml-1">{currentUser.role.name}</span>
            </Badge>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <div className="px-2 py-1.5">
            <p className="text-sm font-medium">Vaihda roolia</p>
            <p className="text-xs text-muted-foreground">Testaa eri käyttäjänäkymiä</p>
          </div>
          <DropdownMenuSeparator />
          {Object.values(roles).map((role) => (
            <DropdownMenuItem
              key={role.id}
              onClick={() => switchRole(role.id)}
              className={`cursor-pointer ${currentUser.role.id === role.id ? 'bg-gray-100' : ''}`}
            >
              <div className="flex items-center gap-3 w-full">
                <div className={`p-1.5 rounded-full ${role.color} text-white`}>
                  {getRoleIcon(role.id)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{role.name}</p>
                  <p className="text-xs text-muted-foreground">{role.description}</p>
                </div>
                {currentUser.role.id === role.id && (
                  <Badge variant="secondary" className="text-xs">
                    Aktiivinen
                  </Badge>
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
