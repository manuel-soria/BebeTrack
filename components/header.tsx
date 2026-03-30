"use client";

import { BabyEvent } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { MoonStar } from "lucide-react";

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
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <MoonStar className="size-6 text-primary" />
            <h1 className="text-[22px] font-black text-foreground tracking-tight">BebeTrack</h1>
          </div>
          <p className="text-sm text-accent font-semibold">{formatDate()}</p>
          {lastReg && (
            <p className="text-[11px] text-muted-foreground mt-0.5">{lastReg}</p>
          )}
        </div>
        {isLive && (
          <Badge variant="outline" className="border-baby-success/40 bg-baby-success/10 text-baby-success text-[10px] font-extrabold">
            En vivo
          </Badge>
        )}
      </div>
    </header>
  );
}
