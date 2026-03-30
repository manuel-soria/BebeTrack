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
import { toDateTimeLocal } from "@/lib/utils";

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
    <div
      className="fixed inset-0 flex items-end justify-center z-[80]"
      style={{ background: "rgba(0,0,0,0.8)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-[440px] max-h-[92vh] overflow-y-auto rounded-t-3xl p-5 pb-8 bg-[#12121F] animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-extrabold text-white">Nuevo registro</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#2A2A4E] text-[#888] hover:text-white cursor-pointer transition-colors"
          >
            ×
          </button>
        </div>

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
                <button
                  key={b.id}
                  onClick={() => setBabyId(b.id)}
                  className="py-3 rounded-xl text-sm font-bold cursor-pointer transition-all"
                  style={{
                    background: babyId === b.id ? `${b.color}20` : "#0D0D1A",
                    border: `2px solid ${babyId === b.id ? b.color : "#2A2A4E"}`,
                    color: babyId === b.id ? b.color : "#666",
                  }}
                >
                  {b.emoji} {b.name}
                </button>
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
            <input
              type="number"
              value={ml || ""}
              onChange={(e) => setMl(e.target.value ? parseInt(e.target.value) : null)}
              placeholder="Otro valor..."
              className="w-full rounded-xl p-3 text-sm bg-[#0D0D1A] border border-[#2A2A4E] text-white placeholder-[#555] focus:border-[#4FC3F7] focus:outline-none transition-colors"
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
          <input
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            className="w-full rounded-xl p-3 text-sm bg-[#0D0D1A] border border-[#2A2A4E] text-white focus:border-[#4FC3F7] focus:outline-none transition-colors"
          />
        </Section>

        {/* Notes */}
        <Section title="Notas (opcional)">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full rounded-xl p-3 text-sm resize-none bg-[#0D0D1A] border border-[#2A2A4E] text-white placeholder-[#555] focus:border-[#4FC3F7] focus:outline-none transition-colors"
            placeholder="Agregar nota..."
          />
        </Section>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-4 rounded-xl text-base font-extrabold cursor-pointer disabled:opacity-50 active:scale-[0.98] transition-transform mt-2"
          style={{
            background: "linear-gradient(135deg, #4FC3F7, #81C784)",
            color: "#000",
            boxShadow: "0 4px 20px rgba(79, 195, 247, 0.3)",
          }}
        >
          {saving ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <div className="text-[10px] text-[#666] font-bold tracking-widest uppercase mb-2">
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
    <button
      onClick={onClick}
      className="px-4 py-2.5 rounded-xl text-sm font-bold cursor-pointer transition-all"
      style={{
        background: active ? `${color}20` : "#0D0D1A",
        border: `1.5px solid ${active ? color : "#2A2A4E"}`,
        color: active ? color : "#666",
      }}
    >
      {label}
    </button>
  );
}
