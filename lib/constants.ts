import { Baby, EventType } from "./types";

export const BABIES: Baby[] = [
  { id: "santi", name: "Santi", color: "#4FC3F7", emoji: "🐻" },
  { id: "jero", name: "Jero", color: "#81C784", emoji: "🦁" },
];

export const EVENT_TYPES: Record<string, EventType> = {
  feed: { label: "Alimento", icon: "🍼", color: "#4FC3F7" },
  pee: { label: "Pis", icon: "💧", color: "#FFF176" },
  poop: { label: "Popo", icon: "💩", color: "#FFCC80" },
  bath: { label: "Bano", icon: "🛁", color: "#CE93D8" },
  extraction: { label: "Extraccion", icon: "🥛", color: "#F48FB1" },
  other: { label: "Otro", icon: "📝", color: "#90A4AE" },
};

export const FEED_SUBTYPES = [
  { id: "breast", label: "Teta" },
  { id: "pumped", label: "Leche extraida" },
  { id: "formula", label: "Formula" },
  { id: "solid", label: "Solido" },
];

export const OTHER_SUBTYPES = [
  { id: "weighing", label: "Pesada", icon: "⚖️" },
  { id: "illness", label: "Enfermedad", icon: "🤒" },
  { id: "generic", label: "Nota", icon: "📌" },
];

export const POOP_CONSISTENCY = ["Liquida", "Blanda", "Firme", "Dura"];
export const POOP_COLORS = ["Amarillo", "Verde", "Marron", "Negro", "Rojo"];
export const BREAST_DURATIONS = [5, 10, 15, 20, 25];
export const ML_OPTIONS = [50, 100, 150, 170, 200];

export const LOG_TYPES = [
  { id: "all", label: "Todos" },
  { id: "feed", label: "🍼 Alimento" },
  { id: "pee", label: "💧 Pis" },
  { id: "poop", label: "💩 Popo" },
  { id: "bath", label: "🛁 Bano" },
  { id: "extraction", label: "🥛 Extraccion" },
  { id: "other", label: "📝 Otro" },
];

export const RANGES = [
  { id: "24h", label: "24 hs" },
  { id: "7d", label: "7 dias" },
  { id: "30d", label: "Mes" },
  { id: "all", label: "Total" },
];
