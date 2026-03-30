"use client";

import { BabyEvent } from "@/lib/types";
import { BABIES } from "@/lib/constants";
import { EventRow } from "@/components/event-row";
import { timeStr } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";

interface ExtractionTabProps {
  events: BabyEvent[];
  onDelete: (id: string) => void;
  onAddExtraction: () => void;
}

export function ExtractionTab({ events, onDelete, onAddExtraction }: ExtractionTabProps) {
  const extractions = events
    .filter((e) => e.type === "extraction")
    .sort((a, b) => new Date(b.date_time).getTime() - new Date(a.date_time).getTime());

  const lastExt = extractions[0] || null;
  const lastBreast = events
    .filter((e) => e.type === "feed" && e.subtype === "breast")
    .sort((a, b) => new Date(b.date_time).getTime() - new Date(a.date_time).getTime())[0] || null;

  const lastBreastBaby = lastBreast ? BABIES.find((b) => b.id === lastBreast.baby_id) : null;

  const extH = lastExt ? (Date.now() - new Date(lastExt.date_time).getTime()) / 3600000 : null;
  const breastH = lastBreast ? (Date.now() - new Date(lastBreast.date_time).getTime()) / 3600000 : null;

  const last24h = extractions.filter((e) => new Date(e.date_time) >= new Date(Date.now() - 86400000));
  const totalMl24h = last24h.reduce((a, e) => a + (e.ml || 0), 0);

  return (
    <div className="flex flex-col gap-4">
      {/* Primary Action Button */}
      <Button
        onClick={onAddExtraction}
        className="w-full py-6 rounded-2xl text-base font-bold bg-gradient-to-br from-primary to-baby-green text-background shadow-[0_4px_20px_rgba(79,195,247,0.3)] hover:opacity-90 active:scale-[0.98] transition-transform"
        size="lg"
      >
        <Plus data-icon="inline-start" />
        Nueva extraccion
      </Button>

      {/* Stats Card */}
      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <div className="grid grid-cols-2">
            <div className="p-4 border-r border-border">
              <div className="text-[10px] text-muted-foreground font-bold tracking-wider uppercase mb-2">
                Ultima extraccion
              </div>
              <div className="text-lg font-black text-foreground">
                {extH !== null ? (extH < 1 ? "Ahora" : timeStr(extH)) : "\u2014"}
              </div>
              {lastExt?.ml && (
                <div className="text-sm text-primary mt-1">{lastExt.ml}ml</div>
              )}
            </div>
            <div className="p-4">
              <div className="text-[10px] text-muted-foreground font-bold tracking-wider uppercase mb-2">
                Ultima succion
              </div>
              <div className="text-lg font-black text-foreground">
                {breastH !== null ? (breastH < 1 ? "Ahora" : timeStr(breastH)) : "\u2014"}
              </div>
              {lastBreastBaby && (
                <div className="text-sm mt-1" style={{ color: lastBreastBaby.color }}>
                  {lastBreastBaby.emoji} {lastBreastBaby.name}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Card */}
      <Card className="border-accent/40 bg-accent/10">
        <CardHeader>
          <CardTitle className="text-[10px] text-accent font-bold tracking-wider uppercase">
            Analisis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {extractions.length === 0 
              ? "Sin extracciones registradas aun. Agrega tu primera extraccion para comenzar el seguimiento."
              : extractions.length === 1
              ? "Solo hay una extraccion registrada. Agrega mas para ver tendencias."
              : `${last24h.length} extracciones en las ultimas 24h (${totalMl24h}ml total). ${
                  extH !== null && extH > 4 ? "Considera extraer pronto." : "Buen ritmo!"
                }`
            }
          </p>
        </CardContent>
      </Card>

      <Separator className="bg-border" />

      {/* History */}
      <div>
        <div className="text-[11px] text-muted-foreground font-bold tracking-widest uppercase mb-3">
          Historial
        </div>
        {extractions.length > 0 ? (
          <div className="flex flex-col gap-2">
            {extractions.slice(0, 10).map((ev) => (
              <EventRow key={ev.id} event={ev} showDelete onDelete={onDelete} />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8 text-sm">
            Sin extracciones registradas
          </div>
        )}
      </div>
    </div>
  );
}
