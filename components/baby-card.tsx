"use client";

import { BabyEvent, Baby } from "@/lib/types";
import { timeStr, cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardAction, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Baby as BabyIcon, Droplets, ShowerHead, Milk } from "lucide-react";

interface Stats24h {
  feeds: number;
  totalMl: number;
  pees: number;
  poops: number;
  lastPoopH: number | null;
  lastBathH: number | null;
}

function getStats24h(events: BabyEvent[], babyId: string): Stats24h {
  const since = new Date(Date.now() - 86400000);
  const evs = events.filter(
    (e) => e.baby_id === babyId && new Date(e.date_time) >= since
  );
  const feeds = evs.filter((e) => e.type === "feed");
  const lastPoop = events
    .filter((e) => e.baby_id === babyId && e.type === "poop")
    .sort((a, b) => new Date(b.date_time).getTime() - new Date(a.date_time).getTime())[0];
  const lastBath = events
    .filter((e) => e.baby_id === babyId && e.type === "bath")
    .sort((a, b) => new Date(b.date_time).getTime() - new Date(a.date_time).getTime())[0];

  return {
    feeds: feeds.length,
    totalMl: feeds.reduce((a, e) => a + (e.ml || 0), 0),
    pees: evs.filter((e) => e.type === "pee").length,
    poops: evs.filter((e) => e.type === "poop").length,
    lastPoopH: lastPoop
      ? (Date.now() - new Date(lastPoop.date_time).getTime()) / 3600000
      : null,
    lastBathH: lastBath
      ? (Date.now() - new Date(lastBath.date_time).getTime()) / 3600000
      : null,
  };
}

interface BabyCardProps {
  baby: Baby;
  events: BabyEvent[];
}

export function BabyCard({ baby, events }: BabyCardProps) {
  const s = getStats24h(events, baby.id);

  const statCells = [
    { lbl: "Alimento", val: s.feeds, Icon: Milk },
    { lbl: "ml (24h)", val: s.totalMl || "\u2014", Icon: BabyIcon },
    { lbl: "Pis", val: s.pees, Icon: Droplets },
    { lbl: "Popo", val: s.poops, Icon: ShowerHead },
  ];

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">{baby.emoji}</span>
          <span className="text-xl font-extrabold" style={{ color: baby.color }}>
            {baby.name}
          </span>
        </CardTitle>
        <CardAction>
          <Badge variant="secondary" className="text-[10px] font-bold tracking-wider text-muted-foreground">
            ULTIMAS 24H
          </Badge>
        </CardAction>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-4 gap-2">
          {statCells.map((x) => (
            <div
              key={x.lbl}
              className="rounded-xl py-3 text-center bg-secondary border border-border"
            >
              <x.Icon className="size-5 mx-auto mb-1 text-muted-foreground" />
              <div className="text-lg font-extrabold text-foreground">{x.val}</div>
              <div className="text-[9px] text-muted-foreground mt-1 uppercase tracking-wide font-semibold">{x.lbl}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2 mt-3">
          <StatusLine
            label="Ultimo popo"
            text={s.lastPoopH !== null ? timeStr(s.lastPoopH) : "Sin registro"}
            hours={s.lastPoopH}
            type="poop"
          />
          <StatusLine
            label="Ultimo bano"
            text={s.lastBathH !== null ? timeStr(s.lastBathH) : "Sin registro"}
            hours={s.lastBathH}
            type="bath"
          />
        </div>
      </CardContent>
    </Card>
  );
}

function StatusLine({ 
  label,
  text, 
  hours, 
  type 
}: { 
  label: string;
  text: string; 
  hours: number | null;
  type: "poop" | "bath";
}) {
  const getColor = () => {
    if (hours === null) return "muted";
    if (type === "poop") {
      if (hours < 48) return "success";
      if (hours < 120) return "warning";
      return "danger";
    }
    if (hours < 48) return "success";
    if (hours < 72) return "warning";
    return "danger";
  };

  const status = getColor();
  const colorMap: Record<string, { bg: string; border: string; text: string }> = {
    muted: { bg: "bg-secondary", border: "border-border", text: "text-muted-foreground" },
    success: { bg: "bg-baby-success/10", border: "border-baby-success/30", text: "text-baby-success" },
    warning: { bg: "bg-baby-warning/10", border: "border-baby-warning/30", text: "text-baby-warning" },
    danger: { bg: "bg-baby-danger/10", border: "border-baby-danger/30", text: "text-baby-danger" },
  };

  const colors = colorMap[status];

  return (
    <div className={cn(
      "flex items-center gap-3 rounded-xl px-3 py-2.5 border",
      colors.bg,
      colors.border,
    )}>
      <span className={cn("text-xs font-semibold", colors.text)}>
        {label} {text}
      </span>
    </div>
  );
}
