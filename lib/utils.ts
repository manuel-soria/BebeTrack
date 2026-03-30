import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dateOnly = new Date(new Date(iso).toDateString());
  const diff = Math.floor((today.getTime() - dateOnly.getTime()) / 86400000);
  
  if (diff === 0) return "Hoy";
  if (diff === 1) return "Ayer";
  return d.toLocaleDateString("es-AR", { day: "numeric", month: "short" });
}

export function ago(iso: string): string {
  const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return "Ahora";
  if (m < 60) return `Hace ${m} min`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r ? `Hace ${h}h ${r}m` : `Hace ${h}h`;
}

export function toDateTimeLocal(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function timeStr(h: number | null): string {
  if (h === null) return "\u2014";
  if (h < 1) {
    const m = Math.round(h * 60);
    return `hace ${m} min`;
  }
  if (h < 24) return `hace ${Math.floor(h)}h`;
  const d = Math.floor(h / 24);
  return `hace ${d} dia${d !== 1 ? "s" : ""}`;
}

export function poopColor(h: number | null): { color: string; icon: string } {
  if (h === null) return { color: "#90A4AE", icon: "" };
  if (h < 48) return { color: "#66BB6A", icon: "" };
  if (h < 120) return { color: "#FFB74D", icon: "" };
  return { color: "#EF5350", icon: "" };
}

export function feedColor(h: number | null): string {
  if (h === null) return "#90A4AE";
  if (h < 3) return "#66BB6A";
  if (h < 6) return "#FFB74D";
  return "#EF5350";
}

export function bathColor(h: number | null): { color: string; icon: string } {
  if (h === null) return { color: "#90A4AE", icon: "" };
  if (h < 48) return { color: "#66BB6A", icon: "" };
  if (h < 72) return { color: "#FFB74D", icon: "" };
  return { color: "#EF5350", icon: "" };
}

export function rangeStart(r: string): Date {
  if (r === "all") return new Date(0);
  if (r === "24h") return new Date(Date.now() - 86400000);
  const d = new Date();
  d.setDate(d.getDate() - (r === "7d" ? 7 : 30));
  d.setHours(0, 0, 0, 0);
  return d;
}
