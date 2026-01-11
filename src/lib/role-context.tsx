"use client";

import React, { createContext, useContext, useState } from 'react';

// Define the valid roles
type Role = 'recruiter' | 'tech-lead' | 'manager';

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  // Default to 'recruiter' so new visitors see the standard view first
  const [role, setRole] = useState<Role>('recruiter');

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}