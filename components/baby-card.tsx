"use client";

import { BabyEvent, Baby } from "@/lib/types";
import { timeStr } from "@/lib/utils";

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
    { lbl: "Alimento", val: s.feeds, icon: "🍼" },
    { lbl: "ml (24h)", val: s.totalMl || "—", icon: "📊" },
    { lbl: "Pis", val: s.pees, icon: "💧" },
    { lbl: "Popo", val: s.poops, icon: "💩" },
  ];

  return (
    <div className="rounded-2xl overflow-hidden mb-4 border border-[#2A2A4E] bg-[#12121F]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{baby.emoji}</span>
          <span className="text-xl font-extrabold" style={{ color: baby.color }}>
            {baby.name}
          </span>
        </div>
        <div className="text-[10px] font-bold tracking-wider px-3 py-1.5 rounded-full bg-[#1A1A2E] border border-[#2A2A4E] text-[#888]">
          ULTIMAS 24H
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-2 px-4 pb-3">
        {statCells.map((x) => (
          <div
            key={x.lbl}
            className="rounded-xl py-3 text-center bg-[#1A1A2E] border border-[#2A2A4E]"
          >
            <div className="text-lg mb-1">{x.icon}</div>
            <div className="text-lg font-extrabold text-white">{x.val}</div>
            <div className="text-[9px] text-[#666] mt-1 uppercase tracking-wide">{x.lbl}</div>
          </div>
        ))}
      </div>

      {/* Status Lines */}
      <div className="px-4 pb-4 space-y-2">
        <StatusLine
          icon="💩"
          text={s.lastPoopH !== null ? `Ultimo popo ${timeStr(s.lastPoopH)}` : "Sin popo registrado"}
          hours={s.lastPoopH}
          type="poop"
        />
        <StatusLine
          icon="🛁"
          text={s.lastBathH !== null ? `Ultimo bano ${timeStr(s.lastBathH)}` : "Sin banos registrados"}
          hours={s.lastBathH}
          type="bath"
        />
      </div>
    </div>
  );
}

function StatusLine({ 
  icon, 
  text, 
  hours, 
  type 
}: { 
  icon: string; 
  text: string; 
  hours: number | null;
  type: "poop" | "bath";
}) {
  const getColor = () => {
    if (hours === null) return "#666";
    if (type === "poop") {
      if (hours < 48) return "#66BB6A";
      if (hours < 120) return "#FFB74D";
      return "#EF5350";
    }
    // bath
    if (hours < 48) return "#66BB6A";
    if (hours < 72) return "#FFB74D";
    return "#EF5350";
  };

  const color = getColor();

  return (
    <div 
      className="flex items-center gap-3 rounded-xl px-3 py-2.5"
      style={{ 
        background: hours !== null ? `${color}15` : "#1A1A2E",
        border: `1px solid ${hours !== null ? `${color}30` : "#2A2A4E"}`,
      }}
    >
      <span className="text-sm">{icon}</span>
      <span className="text-xs font-semibold" style={{ color: hours !== null ? color : "#666" }}>
        {text}
      </span>
    </div>
  );
}
