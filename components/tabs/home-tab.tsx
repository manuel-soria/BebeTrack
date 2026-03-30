"use client";

import { BabyEvent } from "@/lib/types";
import { BABIES } from "@/lib/constants";
import { BabyCard } from "@/components/baby-card";
import { EventRow } from "@/components/event-row";

interface HomeTabProps {
  events: BabyEvent[];
  onDelete: (id: string) => void;
  onViewAll: () => void;
}

function SpecialDayBanner() {
  const now = new Date();
  const m = now.getMonth() + 1;
  const d = now.getDate();

  const Banner = ({ color, emoji, title, subtitle }: { color: string; emoji: string; title: string; subtitle?: string }) => (
    <div
      className="rounded-2xl p-4 mb-4 text-center border"
      style={{
        background: `${color}15`,
        borderColor: `${color}40`,
      }}
    >
      <div className="text-3xl mb-2">{emoji}</div>
      <div className="text-sm font-black" style={{ color }}>{title}</div>
      {subtitle && <div className="text-xs text-[#999] mt-1">{subtitle}</div>}
    </div>
  );

  if (m === 9 && d === 11) {
    return <Banner color="#FFD700" emoji="🎂" title="Feliz cumple a Santi y Jero!" />;
  }
  if (m === 9 && d === 30) {
    return <Banner color="#81C784" emoji="✝️" title="Hoy es el dia de San Jeronimo" subtitle="Hoy la Iglesia reza por Jero, para que sea Santo!" />;
  }
  if (m === 7 && d === 25) {
    return <Banner color="#4FC3F7" emoji="✝️" title="Hoy es el dia de Santiago Apostol" subtitle="Hoy la Iglesia reza por Santi, para que sea Santo!" />;
  }

  return null;
}

export function HomeTab({ events, onDelete, onViewAll }: HomeTabProps) {
  const recentEvents = events.slice(0, 5);

  return (
    <div className="space-y-4">
      <SpecialDayBanner />
      
      {BABIES.map((baby) => (
        <BabyCard key={baby.id} baby={baby} events={events} />
      ))}

      <div>
        <div className="text-[11px] text-[#555] font-bold tracking-widest uppercase mb-3">
          Ultimos eventos
        </div>
        
        {recentEvents.length > 0 ? (
          <div className="space-y-2">
            {recentEvents.map((ev) => (
              <EventRow key={ev.id} event={ev} showDelete onDelete={onDelete} />
            ))}
          </div>
        ) : (
          <div className="text-center text-[#555] py-8 text-sm">
            Sin registros aun
          </div>
        )}

        <button
          onClick={onViewAll}
          className="w-full py-3 mt-3 rounded-xl text-xs font-semibold cursor-pointer bg-transparent border border-[#2A2A4E] text-[#666] hover:bg-[#1A1A2E] transition-colors"
        >
          Ver todo →
        </button>
      </div>
    </div>
  );
}
