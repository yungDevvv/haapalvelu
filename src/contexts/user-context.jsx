"use client";

import { createContext, useContext, useState } from 'react';

// User roles and their permissions
export const USER_ROLES = {
  HAAPARI: {
    id: 'haapari',
    name: 'Hääpari',
    description: 'Morsiuspari - täydet oikeudet',
    color: 'bg-pink-500',
    permissions: {
      viewDashboard: true,
      manageParticipants: true,
      editProgram: true,
      managePhotos: true,
      manageTasks: true,
      manageNotes: true,
      manageBudget: true,
      inviteGuests: true,
      fullAccess: true
    }
  },
  VIERAS: {
    id: 'vieras',
    name: 'Vieras',
    description: 'Häävieras - katseluoikeudet ja osallistuminen',
    color: 'bg-blue-500',
    permissions: {
      viewDashboard: false,
      manageParticipants: false,
      editProgram: false,
      managePhotos: true, // Can upload photos
      manageTasks: false,
      manageNotes: false,
      manageBudget: false,
      inviteGuests: false,
      fullAccess: false
    }
  }
};

const UserContext = createContext();

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState({
    role: USER_ROLES.HAAPARI,
    name: 'Anna Virtanen',
    avatar: '/avatars/anna.jpg'
  });

  const switchRole = (roleId) => {
    const role = Object.values(USER_ROLES).find(r => r.id === roleId);
    if (role) {
      // Update user info based on role
      const userInfo = {
        role,
        name: getUserNameByRole(roleId),
        avatar: getUserAvatarByRole(roleId)
      };
      setCurrentUser(userInfo);
    }
  };

  const hasPermission = (permission) => {
    return currentUser.role.permissions[permission] || false;
  };

  const getUserNameByRole = (roleId) => {
    switch (roleId) {
      case 'haapari':
        return 'Anna Virtanen';
      case 'vieras':
        return 'Liisa Mäkinen';
      default:
        return 'Käyttäjä';
    }
  };

  const getUserAvatarByRole = (roleId) => {
    switch (roleId) {
      case 'haapari':
        return '/avatars/anna.jpg';
      case 'vieras':
        return '/avatars/liisa.jpg';
      default:
        return '/avatars/default.jpg';
    }
  };

  const value = {
    currentUser,
    switchRole,
    hasPermission,
    roles: USER_ROLES
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
