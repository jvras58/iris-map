"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface AuthTabContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AuthTabContext = createContext<AuthTabContextType | null>(null);

export const useAuthTab = () => {
  const context = useContext(AuthTabContext);
  if (!context) {
    throw new Error('useAuthTab deve ser usado dentro AuthTabProvider');
  }
  return context;
};

export function AuthTabProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <AuthTabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </AuthTabContext.Provider>
  );
}
