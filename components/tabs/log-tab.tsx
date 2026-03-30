"use client";

import { useState } from "react";
import { BabyEvent } from "@/lib/types";
import { BABIES, EVENT_TYPES } from "@/lib/constants";
import { EventRow } from "@/components/event-row";
import { formatDate } from "@/lib/utils";

interface LogTabProps {
  events: BabyEvent[];
  onDelete: (id: string) => void;
}

const TYPE_FILTERS = [
  { id: "all", label: "Todos", icon: null },
  { id: "feed", label: "Alimento", icon: "🍼" },
  { id: "pee", label: "Pis", icon: "💧" },
  { id: "poop", label: "Popo", icon: "💩" },
  { id: "bath", label: "Bano", icon: "🛁" },
  { id: "extraction", label: "Extraccion", icon: "🥛" },
  { id: "other", label: "Otro", icon: "📝" },
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

  // Group by date
  const grouped: Record<string, BabyEvent[]> = {};
  filtered.forEach((ev) => {
    const key = formatDate(ev.date_time);
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(ev);
  });

  return (
    <div>
      {/* Baby Filter */}
      <div className="mb-4">
        <div className="text-[10px] text-[#555] font-bold tracking-widest uppercase mb-2">
          Por bebe
        </div>
        <div className="flex flex-wrap gap-2">
          <FilterChip
            label="Todos"
            active={filterBaby === "all"}
            onClick={() => setFilterBaby("all")}
            color="#666"
          />
          {BABIES.map((b) => (
            <FilterChip
              key={b.id}
              label={b.name}
              active={filterBaby === b.id}
              onClick={() => setFilterBaby(b.id)}
              color={b.color}
            />
          ))}
        </div>
      </div>

      {/* Type Filter */}
      <div className="mb-4">
        <div className="text-[10px] text-[#555] font-bold tracking-widest uppercase mb-2">
          Por tipo
        </div>
        <div className="flex flex-wrap gap-2">
          {TYPE_FILTERS.map((f) => {
            const et = EVENT_TYPES[f.id];
            const color = et?.color || "#666";
            return (
              <FilterChip
                key={f.id}
                label={f.icon ? `${f.icon} ${f.label}` : f.label}
                active={filterType === f.id}
                onClick={() => setFilterType(f.id)}
                color={color}
              />
            );
          })}
        </div>
      </div>

      {/* Events List */}
      {Object.keys(grouped).length > 0 ? (
        Object.entries(grouped).map(([date, evts]) => (
          <div key={date} className="mb-4">
            <div className="text-[10px] text-[#555] font-bold tracking-widest uppercase mb-2">
              {date}
            </div>
            <div className="space-y-2">
              {evts.map((ev) => (
                <EventRow key={ev.id} event={ev} showDelete onDelete={onDelete} />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-[#555] py-12 text-sm">
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
  color,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  color: string;
}) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all"
      style={{
        background: active ? `${color}20` : "transparent",
        border: `1.5px solid ${active ? color : "#2A2A4E"}`,
        color: active ? color : "#666",
      }}
    >
      {label}
    </button>
  );
}
