"use client";

import { BabyEvent } from "@/lib/types";

interface HeaderProps {
  events: BabyEvent[];
  isLive?: boolean;
}

function formatDate(): string {
  const now = new Date();
  const days = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];
  const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  return `${days[now.getDay()]}, ${now.getDate()} De ${months[now.getMonth()]}`;
}

function getLastRegistration(events: BabyEvent[]): string {
  if (!events.length) return "";
  const lastEvent = events[0];
  const mins = Math.round((Date.now() - new Date(lastEvent.date_time).getTime()) / 60000);
  const time = new Date(lastEvent.date_time).toLocaleTimeString("es-AR", { 
    hour: "2-digit", 
    minute: "2-digit" 
  });
  
  let rel: string;
  if (mins < 1) rel = "hace menos de 1 min";
  else if (mins < 60) rel = `hace ${mins} min`;
  else {
    const h = Math.floor(mins / 60);
    const r = mins % 60;
    rel = r ? `hace ${h}h ${r}m` : `hace ${h}h`;
  }
  
  return `Ultimo registro ${rel} (${time})`;
}

export function Header({ events, isLive }: HeaderProps) {
  const lastReg = getLastRegistration(events);
  
  return (
    <header className="px-5 pt-6 pb-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌙</span>
            <h1 className="text-[22px] font-black text-white tracking-tight">BebeTrack</h1>
          </div>
          <p className="text-sm text-[#9C6ADE] mt-0.5">{formatDate()}</p>
          {lastReg && (
            <p className="text-[11px] text-[#666] mt-1">{lastReg}</p>
          )}
        </div>
        {isLive && (
          <div className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-[#66BB6A20] text-[#66BB6A] border border-[#66BB6A40]">
            En vivo
          </div>
        )}
      </div>
    </header>
  );
}
