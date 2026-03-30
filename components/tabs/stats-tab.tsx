"use client";

import { useState } from "react";
import { BabyEvent } from "@/lib/types";
import { BABIES, RANGES } from "@/lib/constants";
import { rangeStart, cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
    <div className="flex flex-col gap-4">
      {/* Range Selector */}
      <div className="flex flex-wrap gap-1.5">
        {RANGES.map((r) => (
          <Button
            key={r.id}
            variant={statsRange === r.id ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setStatsRange(r.id)}
            className={cn(
              "rounded-full text-xs font-bold px-4 border transition-all",
              statsRange === r.id 
                ? "bg-primary/20 border-primary/40 text-primary" 
                : "border-border text-muted-foreground"
            )}
          >
            {r.label}
          </Button>
        ))}
      </div>

      {/* Summary Card */}
      <Card className="border-accent/40 bg-accent/10">
        <CardHeader>
          <CardTitle className="text-[10px] text-accent font-bold tracking-wider uppercase">
            Como venimos?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">{narrative}</p>
        </CardContent>
      </Card>

      {/* Baby Stats Cards */}
      {BABIES.map((baby) => {
        const rs = getStatsForRange(events, baby.id, statsRange);
        
        return (
          <Card key={baby.id} className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-xl">{baby.emoji}</span>
                <span className="text-lg font-extrabold" style={{ color: baby.color }}>
                  {baby.name}
                </span>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="flex flex-col gap-3">
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2">
                <StatCell label="Pis" value={rs.pees} color="#FFF176" />
                <StatCell label="Popo" value={rs.poops} color="#FFCC80" />
                <StatCell label="Banos" value={rs.baths} color="#CE93D8" />
              </div>

              <Separator className="bg-border" />

              {/* Feeding Detail */}
              <div className="flex flex-col gap-2">
                {rs.breast.count > 0 && (
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs text-muted-foreground">Teta</span>
                    <Badge variant="secondary" className="text-xs">
                      {rs.breast.count}x · {rs.breast.totalMin}m
                    </Badge>
                  </div>
                )}
                {rs.pumped.count > 0 && (
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs text-muted-foreground">Extraida</span>
                    <Badge variant="secondary" className="text-xs">
                      {rs.pumped.count}x · {rs.pumped.totalMl}ml
                    </Badge>
                  </div>
                )}
                {rs.formula.count > 0 && (
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs text-muted-foreground">Formula</span>
                    <Badge variant="secondary" className="text-xs">
                      {rs.formula.count}x · {rs.formula.totalMl}ml
                    </Badge>
                  </div>
                )}
                {rs.solid.count > 0 && (
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs text-muted-foreground">Solido</span>
                    <Badge variant="secondary" className="text-xs">
                      {rs.solid.count}x
                    </Badge>
                  </div>
                )}
                {rs.breast.count === 0 && rs.pumped.count === 0 && rs.formula.count === 0 && rs.solid.count === 0 && (
                  <p className="text-xs text-muted-foreground px-1">Sin alimentacion registrada.</p>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Timeline */}
      <div>
        <div className="text-[11px] text-muted-foreground font-bold tracking-widest uppercase mb-3">
          Linea de tiempo
        </div>
        <div className="flex justify-between items-end px-2">
          {["L", "M", "M", "J", "V", "S", "D"].map((day, i) => {
            const isActive = i === 6;
            const hasData = i >= 5;
            return (
              <div key={i} className="flex flex-col items-center gap-2">
                {hasData && (
                  <div className="text-[10px] text-primary font-bold">{i === 6 ? "1" : ""}</div>
                )}
                <div 
                  className={cn(
                    "w-8 rounded-full transition-all",
                    hasData ? "bg-primary" : "bg-border"
                  )}
                  style={{
                    height: hasData ? (i === 6 ? "24px" : "12px") : "4px",
                  }}
                />
                <div 
                  className={cn(
                    "text-[10px] font-bold",
                    isActive ? "text-foreground" : "text-muted-foreground"
                  )}
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

function StatCell({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div 
      className="rounded-xl py-3 text-center border border-border"
      style={{ background: `${color}10` }}
    >
      <div className="text-lg font-extrabold text-foreground">{value}</div>
      <div className="text-[9px] text-muted-foreground uppercase tracking-wide font-semibold">{label}</div>
    </div>
  );
}
