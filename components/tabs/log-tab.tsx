"use client";

import { useState } from "react";
import { BabyEvent } from "@/lib/types";
import { BABIES, EVENT_TYPES } from "@/lib/constants";
import { EventRow } from "@/components/event-row";
import { formatDate, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface LogTabProps {
  events: BabyEvent[];
  onDelete: (id: string) => void;
}

const TYPE_FILTERS = [
  { id: "all", label: "Todos", icon: null },
  { id: "feed", label: "Alimento", icon: null },
  { id: "pee", label: "Pis", icon: null },
  { id: "poop", label: "Popo", icon: null },
  { id: "bath", label: "Bano", icon: null },
  { id: "extraction", label: "Extraccion", icon: null },
  { id: "other", label: "Otro", icon: null },
];

export function LogTab({ events, onDelete }: LogTabProps) {
  const [filterBaby, setFilterBaby] = useState("all");
  const [filterType, setFilterType] = useState("all");

  let filtered = events;
  if (filterBaby !== "all") {
    filtered = filtered.filter((e) => e.baby_id === filterBaby);
  }
  if (filterType !== "all") {
    filtered = filtered.filter((e) => e.type === filterType);
  }

  const grouped: Record<string, BabyEvent[]> = {};
  filtered.forEach((ev) => {
    const key = formatDate(ev.date_time);
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(ev);
  });

  return (
    <div>
      <div className="mb-4">
        <div className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase mb-2">
          Por bebe
        </div>
        <div className="flex flex-wrap gap-1.5">
          <FilterChip
            label="Todos"
            active={filterBaby === "all"}
            onClick={() => setFilterBaby("all")}
          />
          {BABIES.map((b) => (
            <FilterChip
              key={b.id}
              label={b.name}
              active={filterBaby === b.id}
              onClick={() => setFilterBaby(b.id)}
              activeColor={b.color}
            />
          ))}
        </div>
      </div>

      <div className="mb-4">
        <div className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase mb-2">
          Por tipo
        </div>
        <div className="flex flex-wrap gap-1.5">
          {TYPE_FILTERS.map((f) => {
            const et = EVENT_TYPES[f.id];
            return (
              <FilterChip
                key={f.id}
                label={f.label}
                active={filterType === f.id}
                onClick={() => setFilterType(f.id)}
                activeColor={et?.color}
              />
            );
          })}
        </div>
      </div>

      <Separator className="mb-4 bg-border" />

      {Object.keys(grouped).length > 0 ? (
        Object.entries(grouped).map(([date, evts]) => (
          <div key={date} className="mb-4">
            <div className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase mb-2">
              {date}
            </div>
            <div className="flex flex-col gap-2">
              {evts.map((ev) => (
                <EventRow key={ev.id} event={ev} showDelete onDelete={onDelete} />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-muted-foreground py-12 text-sm">
          Sin registros
        </div>
      )}
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
  activeColor,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  activeColor?: string;
}) {
  return (
    <Button
      variant={active ? "secondary" : "ghost"}
      size="sm"
      onClick={onClick}
      className={cn(
        "rounded-full text-xs font-bold px-3 border transition-all",
        active 
          ? "border-primary/40" 
          : "border-border text-muted-foreground"
      )}
      style={active && activeColor ? { 
        background: `${activeColor}20`, 
        borderColor: activeColor,
        color: activeColor 
      } : undefined}
    >
      {label}
    </Button>
  );
}
