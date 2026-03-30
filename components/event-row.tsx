"use client";

import { BabyEvent } from "@/lib/types";
import { BABIES, EVENT_TYPES, FEED_SUBTYPES, OTHER_SUBTYPES } from "@/lib/constants";
import { formatTime, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface EventRowProps {
  event: BabyEvent;
  showDelete?: boolean;
  onDelete?: (id: string) => void;
  onClick?: () => void;
}

export function EventRow({ event, showDelete, onDelete, onClick }: EventRowProps) {
  const baby = event.baby_id ? BABIES.find((b) => b.id === event.baby_id) : null;
  const et = EVENT_TYPES[event.type] || { label: "Otro", icon: "", color: "#90A4AE" };
  
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
      className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border cursor-pointer active:bg-secondary transition-colors"
      onClick={onClick}
    >
      <div 
        className="size-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${et.color}15` }}
      >
        <span className="text-xl">{et.icon}</span>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold truncate">
          {baby && (
            <span style={{ color: baby.color }}>{baby.name}</span>
          )}
          {baby && <span className="text-muted-foreground"> · </span>}
          <span style={{ color: et.color }}>{label}</span>
          {detailStr && <span className="text-foreground">{detailStr}</span>}
        </div>
        {event.notes && (
          <div className="text-[11px] text-muted-foreground mt-0.5 truncate">{event.notes}</div>
        )}
      </div>
      
      <div className="text-right shrink-0">
        <div className="text-xs text-muted-foreground font-medium">{formatTime(event.date_time)}</div>
        <div className="text-[10px] text-muted-foreground/60">
          {isToday ? timeAgo : formatDate(event.date_time)}
        </div>
      </div>
      
      {showDelete && onDelete && (
        <Button
          variant="destructive"
          size="icon-sm"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(event.id);
          }}
          aria-label="Eliminar"
        >
          <Trash2 />
        </Button>
      )}
    </div>
  );
}
