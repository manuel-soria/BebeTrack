"use client";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TABS = [
  { id: "home", icon: "🏠", label: "Inicio" },
  { id: "log", icon: "📋", label: "Historial" },
  { id: "stats", icon: "📊", label: "Stats" },
  { id: "extraction", icon: "🪣", label: "Extraccion" },
];

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 flex justify-around items-center py-3 px-4 max-w-[440px] mx-auto"
      style={{
        background: "linear-gradient(to top, #0A0A15 95%, #0A0A1500)",
        paddingBottom: "env(safe-area-inset-bottom, 16px)",
      }}
    >
      {TABS.map((tab) => {
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="flex flex-col items-center gap-0.5 cursor-pointer bg-transparent border-none"
          >
            <span
              className="text-xl transition-transform"
              style={{
                filter: active ? "none" : "grayscale(100%)",
                opacity: active ? 1 : 0.5,
                transform: active ? "scale(1.15)" : "scale(1)",
              }}
            >
              {tab.icon}
            </span>
            <span
              className="text-[10px] font-bold"
              style={{ color: active ? "#4FC3F7" : "#555" }}
            >
              {tab.label}
            </span>
            {active && (
              <div
                className="w-1 h-1 rounded-full mt-0.5"
                style={{ background: "#4FC3F7" }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
