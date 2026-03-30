"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Home, ClipboardList, Milk, BarChart3 } from "lucide-react";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TABS = [
  { id: "home", icon: Home, label: "Inicio" },
  { id: "log", icon: ClipboardList, label: "Registro" },
  { id: "extraction", icon: Milk, label: "Extraccion" },
  { id: "stats", icon: BarChart3, label: "Resumen" },
];

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div 
        className="max-w-[440px] mx-auto flex justify-around items-end px-2 pt-2 pb-4 bg-gradient-to-t from-background via-background to-transparent"
        style={{
          paddingBottom: "max(env(safe-area-inset-bottom, 12px), 12px)",
        }}
      >
        {TABS.slice(0, 2).map((tab) => (
          <NavItem 
            key={tab.id} 
            tab={tab} 
            active={activeTab === tab.id}
            onClick={() => onTabChange(tab.id)}
          />
        ))}
        
        <div className="w-16" />
        
        {TABS.slice(2).map((tab) => (
          <NavItem 
            key={tab.id} 
            tab={tab} 
            active={activeTab === tab.id}
            onClick={() => onTabChange(tab.id)}
          />
        ))}
      </div>
    </nav>
  );
}

function NavItem({ 
  tab, 
  active, 
  onClick 
}: { 
  tab: { id: string; icon: React.ComponentType<{ className?: string }>; label: string }; 
  active: boolean;
  onClick: () => void;
}) {
  const Icon = tab.icon;
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 h-auto min-w-[60px] px-2 py-1.5 rounded-xl transition-all",
        active ? "text-primary" : "text-muted-foreground hover:text-foreground"
      )}
    >
      <Icon className={cn(
        "size-5 transition-transform",
        active && "scale-110"
      )} />
      <span className={cn(
        "text-[10px] font-bold",
        active ? "text-primary" : "text-muted-foreground"
      )}>
        {tab.label}
      </span>
      {active && (
        <div className="size-1 rounded-full bg-primary" />
      )}
    </Button>
  );
}
