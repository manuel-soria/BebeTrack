"use client";

import { useState } from "react";
import { BabyEvent } from "@/lib/types";
import { BABIES, RANGES } from "@/lib/constants";
import { rangeStart } from "@/lib/utils";

interface StatsTabProps {
  events: BabyEvent[];
}

interface RangeStats {
  baths: number;
  pees: number;
  poops: number;
  breast: { count: number; totalMin: number };
  pumped: { count: number; totalMl: number };
  formula: { count: number; totalMl: number };
  solid: { count: number };
}

function getStatsForRange(events: BabyEvent[], babyId: string, range: string): RangeStats {
  const since = rangeStart(range);
  const evs = events.filter((e) => e.baby_id === babyId && new Date(e.date_time) >= since);
  const br = evs.filter((e) => e.type === "feed" && e.subtype === "breast");
  const pu = evs.filter((e) => e.type === "feed" && e.subtype === "pumped");
  const fo = evs.filter((e) => e.type === "feed" && e.subtype === "formula");
  const so = evs.filter((e) => e.type === "feed" && e.subtype === "solid");

  return {
    baths: evs.filter((e) => e.type === "bath").length,
    pees: evs.filter((e) => e.type === "pee").length,
    poops: evs.filter((e) => e.type === "poop").length,
    breast: { count: br.length, totalMin: br.reduce((a, e) => a + (e.duration_min || 0), 0) },
    pumped: { count: pu.length, totalMl: pu.reduce((a, e) => a + (e.ml || 0), 0) },
    formula: { count: fo.length, totalMl: fo.reduce((a, e) => a + (e.ml || 0), 0) },
    solid: { count: so.length },
  };
}

function buildNarrative(events: BabyEvent[], range: string): string {
  const rsA = getStatsForRange(events, "santi", range);
  const rsB = getStatsForRange(events, "jero", range);
  
  const totalFA = rsA.breast.count + rsA.pumped.count + rsA.formula.count + rsA.solid.count;
  const totalFB = rsB.breast.count + rsB.pumped.count + rsB.formula.count + rsB.solid.count;
  
  const parts: string[] = [];
  
  if (totalFA === 0 && totalFB === 0) {
    parts.push("Sin alimentacion registrada en el periodo.");
  } else if (totalFA > totalFB * 1.4) {
    parts.push("Santi tomo bastante mas que Jero.");
  } else if (totalFB > totalFA * 1.4) {
    parts.push("Jero tomo bastante mas que Santi.");
  } else {
    parts.push("Ambos con alimentacion similar.");
  }
  
  if (rsA.baths === 0 && range !== "24h") parts.push("Santi sin banos en el periodo.");
  if (rsB.baths === 0 && range !== "24h") parts.push("Jero sin banos en el periodo.");
  
  return parts.join(" ");
}

export function StatsTab({ events }: StatsTabProps) {
  const [statsRange, setStatsRange] = useState("7d");
  const narrative = buildNarrative(events, statsRange);

  return (
    <div className="space-y-4">
      {/* Range Selector */}
      <div className="flex flex-wrap gap-2">
        {RANGES.map((r) => (
          <button
            key={r.id}
            onClick={() => setStatsRange(r.id)}
            className="px-4 py-2 rounded-full text-xs font-bold cursor-pointer transition-all"
            style={{
              background: statsRange === r.id ? "#4FC3F720" : "transparent",
              border: `1.5px solid ${statsRange === r.id ? "#4FC3F7" : "#2A2A4E"}`,
              color: statsRange === r.id ? "#4FC3F7" : "#666",
            }}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Summary Card */}
      <div className="rounded-2xl p-4 border border-[#9C6ADE40] bg-[#9C6ADE10]">
        <div className="text-[10px] text-[#9C6ADE] font-bold tracking-wider uppercase mb-2">
          Como venimos?
        </div>
        <p className="text-sm text-[#ccc] leading-relaxed">{narrative}</p>
      </div>

      {/* Baby Stats Cards */}
      {BABIES.map((baby) => {
        const rs = getStatsForRange(events, baby.id, statsRange);
        
        return (
          <div
            key={baby.id}
            className="rounded-2xl overflow-hidden border border-[#2A2A4E] bg-[#12121F]"
          >
            <div className="px-4 pt-4 pb-3 flex items-center gap-2">
              <span className="text-xl">{baby.emoji}</span>
              <span className="text-lg font-extrabold" style={{ color: baby.color }}>
                {baby.name}
              </span>
            </div>
            
            {/* Feeding Stats */}
            {rs.breast.count > 0 && (
              <div className="px-4 py-2 border-t border-[#2A2A4E] flex items-center gap-3">
                <span className="text-lg">🤱</span>
                <div>
                  <div className="text-sm font-bold text-white">
                    {rs.breast.count}x · {rs.breast.totalMin}m
                  </div>
                  <div className="text-[10px] text-[#666]">Teta</div>
                </div>
              </div>
            )}
            
            {/* Summary Row */}
            <div className="px-4 py-3 border-t border-[#2A2A4E] bg-[#0D0D1A]">
              <p className="text-xs text-[#888] leading-relaxed">
                {rs.breast.count > 0 
                  ? `Alimentacion: ${rs.breast.count} ${rs.breast.count === 1 ? "vez" : "veces"} de teta (${rs.breast.totalMin} min en total).`
                  : "Sin registros de alimentacion."
                }
                {rs.poops === 0 ? " No hay registros de popo aun." : ` ${rs.poops} popo${rs.poops !== 1 ? "s" : ""}.`}
                {rs.baths === 0 ? " Sin banos registrados." : ` ${rs.baths} bano${rs.baths !== 1 ? "s" : ""}.`}
              </p>
            </div>
          </div>
        );
      })}

      {/* Timeline placeholder */}
      <div>
        <div className="text-[11px] text-[#555] font-bold tracking-widest uppercase mb-3">
          Linea de tiempo
        </div>
        <div className="flex justify-between items-end px-2">
          {["L", "M", "M", "J", "V", "S", "D"].map((day, i) => {
            const isActive = i === 6;
            const hasData = i >= 5;
            return (
              <div key={i} className="flex flex-col items-center gap-2">
                {hasData && (
                  <div className="text-[10px] text-[#4FC3F7] font-bold">{i === 6 ? "1" : ""}</div>
                )}
                <div 
                  className="w-8 rounded-full transition-all"
                  style={{
                    height: hasData ? (i === 6 ? "24px" : "12px") : "4px",
                    background: hasData ? "#4FC3F7" : "#2A2A4E",
                  }}
                />
                <div 
                  className="text-[10px] font-bold"
                  style={{ color: isActive ? "#fff" : "#555" }}
                >
                  {day}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
