"use client";

import { BabyEvent } from "@/lib/types";
import { BABIES, EVENT_TYPES, FEED_SUBTYPES, OTHER_SUBTYPES } from "@/lib/constants";
import { formatTime, formatDate } from "@/lib/utils";

interface EventRowProps {
  event: BabyEvent;
  showDelete?: boolean;
  onDelete?: (id: string) => void;
  onClick?: () => void;
}

export function EventRow({ event, showDelete, onDelete, onClick }: EventRowProps) {
  const baby = event.baby_id ? BABIES.find((b) => b.id === event.baby_id) : null;
  const et = EVENT_TYPES[event.type] || { label: "Otro", icon: "📝", color: "#90A4AE" };
  
  let label = et.label;
  if (event.type === "feed" && event.subtype) {
    label = FEED_SUBTYPES.find((s) => s.id === event.subtype)?.label || label;
  }
  if (event.type === "other" && event.other_subtype) {
    const o = OTHER_SUBTYPES.find((s) => s.id === event.other_subtype);
    if (o) label = o.label;
  }

  const details: string[] = [];
  if (event.ml) details.push(`${event.ml}ml`);
  if (event.duration_min) details.push(`${event.duration_min}min`);

  const detailStr = details.length ? ` · ${details.join(" · ")}` : "";
  const babyColor = baby?.color || "#F48FB1";

  const eventDate = new Date(event.date_time);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventDay = new Date(eventDate);
  eventDay.setHours(0, 0, 0, 0);
  const isToday = eventDay.getTime() === today.getTime();
  
  const timeDiff = Date.now() - eventDate.getTime();
  const mins = Math.round(timeDiff / 60000);
  let timeAgo: string;
  if (mins < 1) timeAgo = "Ahora";
  else if (mins < 60) timeAgo = `Hace ${mins} min`;
  else {
    const h = Math.floor(mins / 60);
    timeAgo = `Hace ${h}h`;
  }

  return (
    <div
      className="flex items-center gap-3 p-3 rounded-xl bg-[#12121F] border border-[#2A2A4E] cursor-pointer active:bg-[#1A1A2E] transition-colors"
      onClick={onClick}
    >
      {/* Icon */}
      <div 
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${et.color}15` }}
      >
        <span className="text-xl">{et.icon}</span>
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold truncate">
          {baby && (
            <span style={{ color: babyColor }}>{baby.name}</span>
          )}
          {baby && <span className="text-[#666]"> · </span>}
          <span style={{ color: et.color }}>{label}</span>
          {detailStr && <span className="text-white">{detailStr}</span>}
        </div>
        {event.notes && (
          <div className="text-[11px] text-[#666] mt-0.5 truncate">{event.notes}</div>
        )}
      </div>
      
      {/* Time */}
      <div className="text-right shrink-0">
        <div className="text-xs text-[#888] font-medium">{formatTime(event.date_time)}</div>
        <div className="text-[10px] text-[#555]">
          {isToday ? timeAgo : formatDate(event.date_time)}
        </div>
      </div>
      
      {/* Delete Button */}
      {showDelete && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(event.id);
          }}
          className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer bg-[#EF535015] border border-[#EF535030] text-sm hover:bg-[#EF535025] transition-colors"
          aria-label="Eliminar"
        >
          🗑️
        </button>
      )}
    </div>
  );
}
