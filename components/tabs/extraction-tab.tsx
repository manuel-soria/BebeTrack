"use client";

import { BabyEvent } from "@/lib/types";
import { BABIES } from "@/lib/constants";
import { EventRow } from "@/components/event-row";
import { timeStr } from "@/lib/utils";

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

  // Stats
  const last24h = extractions.filter((e) => new Date(e.date_time) >= new Date(Date.now() - 86400000));
  const totalMl24h = last24h.reduce((a, e) => a + (e.ml || 0), 0);

  return (
    <div className="space-y-4">
      {/* Primary Action Button */}
      <button
        onClick={onAddExtraction}
        className="w-full py-4 rounded-2xl text-base font-bold cursor-pointer active:scale-[0.98] transition-transform"
        style={{
          background: "linear-gradient(135deg, #4FC3F7, #81C784)",
          color: "#000",
          boxShadow: "0 4px 20px rgba(79, 195, 247, 0.3)",
        }}
      >
        + Nueva extraccion
      </button>

      {/* Stats Card */}
      <div className="rounded-2xl overflow-hidden border border-[#9C6ADE40] bg-[#1A1A2E20]">
        <div className="grid grid-cols-2">
          <div className="p-4 border-r border-[#2A2A4E]">
            <div className="text-[10px] text-[#888] font-bold tracking-wider uppercase mb-2">
              Ultima extraccion
            </div>
            <div className="text-lg font-black text-white">
              {extH !== null ? (extH < 1 ? "Ahora" : timeStr(extH)) : "—"}
            </div>
            {lastExt?.ml && (
              <div className="text-sm text-[#4FC3F7] mt-1">{lastExt.ml}ml</div>
            )}
          </div>
          <div className="p-4">
            <div className="text-[10px] text-[#888] font-bold tracking-wider uppercase mb-2">
              Ultima succion
            </div>
            <div className="text-lg font-black text-white">
              {breastH !== null ? (breastH < 1 ? "Ahora" : timeStr(breastH)) : "—"}
            </div>
            {lastBreastBaby && (
              <div className="text-sm mt-1" style={{ color: lastBreastBaby.color }}>
                {lastBreastBaby.emoji} {lastBreastBaby.name}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Analysis Card */}
      <div className="rounded-2xl p-4 border border-[#9C6ADE40] bg-[#9C6ADE10]">
        <div className="text-[10px] text-[#9C6ADE] font-bold tracking-wider uppercase mb-2">
          Analisis
        </div>
        <p className="text-sm text-[#ccc] leading-relaxed">
          {extractions.length === 0 
            ? "Sin extracciones registradas aun. Agrega tu primera extraccion para comenzar el seguimiento."
            : extractions.length === 1
            ? "Solo hay una extraccion registrada. Agrega mas para ver tendencias."
            : `${last24h.length} extracciones en las ultimas 24h (${totalMl24h}ml total). ${
                extH !== null && extH > 4 ? "Considera extraer pronto." : "Buen ritmo!"
              }`
          }
        </p>
      </div>

      {/* History */}
      <div>
        <div className="text-[11px] text-[#555] font-bold tracking-widest uppercase mb-3">
          Historial
        </div>
        {extractions.length > 0 ? (
          <div className="space-y-2">
            {extractions.slice(0, 10).map((ev) => (
              <EventRow key={ev.id} event={ev} showDelete onDelete={onDelete} />
            ))}
          </div>
        ) : (
          <div className="text-center text-[#555] py-8 text-sm">
            Sin extracciones registradas
          </div>
        )}
      </div>
    </div>
  );
}
