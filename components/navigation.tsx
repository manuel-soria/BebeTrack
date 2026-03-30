"use client";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TABS = [
  { id: "home", icon: "🏠", label: "Inicio" },
  { id: "log", icon: "📋", label: "Registro" },
  { id: "extraction", icon: "🥛", label: "Extraccion" },
  { id: "stats", icon: "📊", label: "Resumen" },
];

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div 
        className="max-w-[440px] mx-auto flex justify-around items-end px-2 pt-2 pb-4"
        style={{
          background: "linear-gradient(to top, #0A0A15 85%, transparent)",
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
        
        {/* Spacer for FAB */}
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
  tab: { id: string; icon: string; label: string }; 
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 bg-transparent border-none cursor-pointer min-w-[60px] transition-all"
    >
      <span
        className="text-xl transition-all duration-200"
        style={{
          filter: active ? "none" : "grayscale(100%)",
          opacity: active ? 1 : 0.5,
          transform: active ? "scale(1.1)" : "scale(1)",
        }}
      >
        {tab.icon}
      </span>
      <span
        className="text-[10px] font-bold transition-colors"
        style={{ color: active ? "#4FC3F7" : "#555" }}
      >
        {tab.label}
      </span>
      {active && (
        <div className="w-1 h-1 rounded-full bg-[#4FC3F7]" />
      )}
    </button>
  );
}
