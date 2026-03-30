"use client";

import { useState } from "react";
import { BabyEvent } from "@/lib/types";
import {
  BABIES,
  EVENT_TYPES,
  FEED_SUBTYPES,
  OTHER_SUBTYPES,
  POOP_CONSISTENCY,
  POOP_COLORS,
  BREAST_DURATIONS,
  ML_OPTIONS,
} from "@/lib/constants";
import { toDateTimeLocal, cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Save } from "lucide-react";

interface AddEventModalProps {
  onClose: () => void;
  onSave: (event: Omit<BabyEvent, "id" | "created_at">) => Promise<void>;
  initialBabyId?: string;
  initialType?: string;
}

export function AddEventModal({
  onClose,
  onSave,
  initialBabyId = "santi",
  initialType = "feed",
}: AddEventModalProps) {
  const [babyId, setBabyId] = useState<string | null>(
    initialType === "extraction" ? null : initialBabyId
  );
  const [type, setType] = useState(initialType);
  const [subtype, setSubtype] = useState<string | null>(
    initialType === "feed" ? "breast" : null
  );
  const [otherSubtype, setOtherSubtype] = useState<string | null>(null);
  const [dateTime, setDateTime] = useState(toDateTimeLocal(new Date().toISOString()));
  const [durationMin, setDurationMin] = useState<number | null>(null);
  const [ml, setMl] = useState<number | null>(null);
  const [consistency, setConsistency] = useState<string | null>(null);
  const [poopColor, setPoopColor] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const handleTypeChange = (newType: string) => {
    setType(newType);
    setSubtype(newType === "feed" ? "breast" : null);
    setOtherSubtype(null);
    setDurationMin(null);
    setMl(null);
    setConsistency(null);
    setPoopColor(null);
    if (newType === "extraction") {
      setBabyId(null);
    } else if (!babyId) {
      setBabyId("santi");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({
        baby_id: babyId,
        type: type as BabyEvent["type"],
        subtype,
        other_subtype: otherSubtype,
        date_time: new Date(dateTime).toISOString(),
        duration_min: durationMin,
        ml,
        consistency,
        poop_color: poopColor,
        notes: notes || null,
      });
      onClose();
    } catch (error) {
      console.error("Error saving event:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet open onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="bottom"
        showCloseButton={false}
        className="max-w-[440px] mx-auto max-h-[92vh] rounded-t-3xl bg-card border-border p-0"
      >
        <SheetHeader className="px-5 pt-5 pb-0">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-extrabold text-foreground">Nuevo registro</SheetTitle>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onClose}
              className="rounded-full text-muted-foreground"
            >
              x
            </Button>
          </div>
          <SheetDescription className="sr-only">Formulario para agregar un nuevo registro</SheetDescription>
        </SheetHeader>

        <ScrollArea className="px-5 pb-5 max-h-[calc(92vh-100px)]">
          <div className="flex flex-col gap-5 pt-4">
            {/* Event Type */}
            <Section title="Tipo">
              <div className="flex flex-wrap gap-2">
                {Object.entries(EVENT_TYPES).map(([key, val]) => (
                  <ChipButton
                    key={key}
                    label={`${val.icon} ${val.label}`}
                    active={type === key}
                    color={val.color}
                    onClick={() => handleTypeChange(key)}
                  />
                ))}
              </div>
            </Section>

            {/* Baby Selection */}
            {type !== "extraction" && (
              <Section title="Bebe">
                <div className="grid grid-cols-2 gap-2">
                  {BABIES.map((b) => (
                    <Button
                      key={b.id}
                      variant="outline"
                      onClick={() => setBabyId(b.id)}
                      className={cn(
                        "py-5 rounded-xl text-sm font-bold transition-all",
                        babyId === b.id
                          ? "border-2"
                          : "border-border text-muted-foreground"
                      )}
                      style={babyId === b.id ? {
                        background: `${b.color}20`,
                        borderColor: b.color,
                        color: b.color,
                      } : undefined}
                    >
                      {b.emoji} {b.name}
                    </Button>
                  ))}
                </div>
              </Section>
            )}

            {/* Feed Subtype */}
            {type === "feed" && (
              <Section title="Tipo de alimento">
                <div className="flex flex-wrap gap-2">
                  {FEED_SUBTYPES.map((s) => (
                    <ChipButton
                      key={s.id}
                      label={s.label}
                      active={subtype === s.id}
                      color="#4FC3F7"
                      onClick={() => setSubtype(s.id)}
                    />
                  ))}
                </div>
              </Section>
            )}

            {/* Duration for breast */}
            {type === "feed" && subtype === "breast" && (
              <Section title="Duracion (minutos)">
                <div className="flex flex-wrap gap-2">
                  {BREAST_DURATIONS.map((d) => (
                    <ChipButton
                      key={d}
                      label={`${d}`}
                      active={durationMin === d}
                      color="#4FC3F7"
                      onClick={() => setDurationMin(d)}
                    />
                  ))}
                </div>
              </Section>
            )}

            {/* ML for pumped, formula, extraction */}
            {((type === "feed" && (subtype === "pumped" || subtype === "formula")) || type === "extraction") && (
              <Section title="Cantidad (ml)">
                <div className="flex flex-wrap gap-2 mb-2">
                  {ML_OPTIONS.map((m) => (
                    <ChipButton
                      key={m}
                      label={`${m}`}
                      active={ml === m}
                      color="#4FC3F7"
                      onClick={() => setMl(m)}
                    />
                  ))}
                </div>
                <Input
                  type="number"
                  value={ml || ""}
                  onChange={(e) => setMl(e.target.value ? parseInt(e.target.value) : null)}
                  placeholder="Otro valor..."
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
                />
              </Section>
            )}

            {/* Poop options */}
            {type === "poop" && (
              <>
                <Section title="Consistencia">
                  <div className="flex flex-wrap gap-2">
                    {POOP_CONSISTENCY.map((c) => (
                      <ChipButton
                        key={c}
                        label={c}
                        active={consistency === c}
                        color="#FFCC80"
                        onClick={() => setConsistency(c)}
                      />
                    ))}
                  </div>
                </Section>
                <Section title="Color">
                  <div className="flex flex-wrap gap-2">
                    {POOP_COLORS.map((c) => (
                      <ChipButton
                        key={c}
                        label={c}
                        active={poopColor === c}
                        color="#FFCC80"
                        onClick={() => setPoopColor(c)}
                      />
                    ))}
                  </div>
                </Section>
              </>
            )}

            {/* Other subtype */}
            {type === "other" && (
              <Section title="Subtipo">
                <div className="flex flex-wrap gap-2">
                  {OTHER_SUBTYPES.map((s) => (
                    <ChipButton
                      key={s.id}
                      label={`${s.icon} ${s.label}`}
                      active={otherSubtype === s.id}
                      color="#90A4AE"
                      onClick={() => setOtherSubtype(s.id)}
                    />
                  ))}
                </div>
              </Section>
            )}

            {/* Date/Time */}
            <Section title="Fecha y hora">
              <Input
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                className="bg-input border-border text-foreground focus:border-primary"
              />
            </Section>

            {/* Notes */}
            <Section title="Notas (opcional)">
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-primary resize-none"
                placeholder="Agregar nota..."
              />
            </Section>

            <Separator className="bg-border" />

            {/* Save Button */}
            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-6 rounded-xl text-base font-extrabold bg-gradient-to-br from-primary to-baby-green text-background shadow-[0_4px_20px_rgba(79,195,247,0.3)] hover:opacity-90 active:scale-[0.98] transition-transform mb-4"
              size="lg"
            >
              <Save data-icon="inline-start" />
              {saving ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase mb-2">
        {title}
      </div>
      {children}
    </div>
  );
}

function ChipButton({
  label,
  active,
  color,
  onClick,
}: {
  label: string;
  active: boolean;
  color: string;
  onClick: () => void;
}) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className={cn(
        "px-4 py-2.5 rounded-xl text-sm font-bold transition-all h-auto",
        active 
          ? "border-2" 
          : "border-border text-muted-foreground"
      )}
      style={active ? {
        background: `${color}20`,
        borderColor: color,
        color: color,
      } : undefined}
    >
      {label}
    </Button>
  );
}
