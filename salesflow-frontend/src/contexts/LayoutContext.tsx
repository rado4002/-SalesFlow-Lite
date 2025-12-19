import { createContext, useContext, useState, useEffect } from "react";

type LayoutContextType = {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
};

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved ? JSON.parse(saved) : false;
  });

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  return (
    <LayoutContext.Provider value={{ sidebarCollapsed, toggleSidebar }}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => {
  const ctx = useContext(LayoutContext);
  if (!ctx) {
    throw new Error("useLayout must be used inside LayoutProvider");
  }
  return ctx;
};
