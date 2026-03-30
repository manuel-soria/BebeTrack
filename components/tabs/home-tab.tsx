"use client";

import { BabyEvent } from "@/lib/types";
import { BABIES } from "@/lib/constants";
import { BabyCard } from "@/components/baby-card";
import { EventRow } from "@/components/event-row";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowRight } from "lucide-react";

interface HomeTabProps {
  events: BabyEvent[];
  onDelete: (id: string) => void;
  onViewAll: () => void;
}

function SpecialDayBanner() {
  const now = new Date();
  const m = now.getMonth() + 1;
  const d = now.getDate();

  const Banner = ({ color, title, subtitle }: { color: string; title: string; subtitle?: string }) => (
    <Card className="text-center" style={{ borderColor: `${color}40`, background: `${color}15` }}>
      <CardContent className="py-4">
        <div className="text-sm font-black" style={{ color }}>{title}</div>
        {subtitle && <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>}
      </CardContent>
    </Card>
  );

  if (m === 9 && d === 11) {
    return <Banner color="#FFD700" title="Feliz cumple a Santi y Jero!" />;
  }
  if (m === 9 && d === 30) {
    return <Banner color="#81C784" title="Hoy es el dia de San Jeronimo" subtitle="Hoy la Iglesia reza por Jero, para que sea Santo!" />;
  }
  if (m === 7 && d === 25) {
    return <Banner color="#4FC3F7" title="Hoy es el dia de Santiago Apostol" subtitle="Hoy la Iglesia reza por Santi, para que sea Santo!" />;
  }

  return null;
}

export function HomeTab({ events, onDelete, onViewAll }: HomeTabProps) {
  const recentEvents = events.slice(0, 5);

  return (
    <div className="flex flex-col gap-4">
      <SpecialDayBanner />
      
      {BABIES.map((baby) => (
        <BabyCard key={baby.id} baby={baby} events={events} />
      ))}

      <Separator className="bg-border" />

      <div>
        <div className="text-[11px] text-muted-foreground font-bold tracking-widest uppercase mb-3">
          Ultimos eventos
        </div>
        
        {recentEvents.length > 0 ? (
          <div className="flex flex-col gap-2">
            {recentEvents.map((ev) => (
              <EventRow key={ev.id} event={ev} showDelete onDelete={onDelete} />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8 text-sm">
            Sin registros aun
          </div>
        )}

        <Button
          variant="outline"
          onClick={onViewAll}
          className="w-full mt-3"
        >
          Ver todo
          <ArrowRight data-icon="inline-end" />
        </Button>
      </div>
    </div>
  );
}
