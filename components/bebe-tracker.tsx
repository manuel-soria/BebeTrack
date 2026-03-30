"use client";

import { useState, useCallback } from "react";
import { useEvents } from "@/lib/hooks/use-events";
import { Header } from "./header";
import { Navigation } from "./navigation";
import { FAB } from "./fab";
import { AddEventModal } from "./add-event-modal";
import { HomeTab } from "./tabs/home-tab";
import { LogTab } from "./tabs/log-tab";
import { StatsTab } from "./tabs/stats-tab";
import { ExtractionTab } from "./tabs/extraction-tab";

export function BebeTracker() {
  const { events, isLoading, addEvent, deleteEvent } = useEvents();
  const [activeTab, setActiveTab] = useState("home");
  const [showModal, setShowModal] = useState(false);
  const [modalInitialType, setModalInitialType] = useState("feed");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  }, []);

  const handleOpenModal = useCallback((type = "feed") => {
    setModalInitialType(type);
    setShowModal(true);
  }, []);

  const handleDelete = useCallback((id: string) => {
    setConfirmDeleteId(id);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (confirmDeleteId) {
      await deleteEvent(confirmDeleteId);
      setConfirmDeleteId(null);
      showToast("Registro eliminado");
    }
  }, [confirmDeleteId, deleteEvent, showToast]);

  const handleSave = useCallback(async (event: Parameters<typeof addEvent>[0]) => {
    await addEvent(event);
    showToast("Guardado correctamente");
  }, [addEvent, showToast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-pulse">🌙</div>
          <div className="text-sm text-[#666] font-medium">Cargando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative pb-24">
      <Header events={events} isLive />

      <main className="px-4">
        {activeTab === "home" && (
          <HomeTab
            events={events}
            onDelete={handleDelete}
            onViewAll={() => setActiveTab("log")}
          />
        )}
        {activeTab === "log" && (
          <LogTab events={events} onDelete={handleDelete} />
        )}
        {activeTab === "stats" && <StatsTab events={events} />}
        {activeTab === "extraction" && (
          <ExtractionTab
            events={events}
            onDelete={handleDelete}
            onAddExtraction={() => handleOpenModal("extraction")}
          />
        )}
      </main>

      <FAB onClick={() => handleOpenModal("feed")} />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {showModal && (
        <AddEventModal
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          initialType={modalInitialType}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <div 
          className="fixed bottom-24 left-1/2 -translate-x-1/2 px-5 py-3 rounded-xl text-sm font-bold z-[100] animate-fade-in"
          style={{
            background: "#1E1E35",
            border: "1px solid #2A2A4E",
            color: "#fff",
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          }}
        >
          {toast}
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 flex items-center justify-center z-[90] animate-fade-in" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="rounded-2xl p-6 w-[300px] text-center bg-[#1A1A2E] border border-[#2A2A4E] animate-slide-up">
            <div className="text-3xl mb-3">🗑️</div>
            <div className="text-lg font-extrabold mb-2 text-white">Eliminar registro?</div>
            <div className="text-sm text-[#888] mb-5">Esta accion no se puede deshacer</div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 py-3 rounded-xl text-sm font-bold cursor-pointer bg-[#0D0D1A] border border-[#2A2A3E] text-[#888] hover:bg-[#1A1A2E] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-3 rounded-xl text-sm font-bold cursor-pointer bg-[#EF535020] border border-[#EF535040] text-[#EF5350] hover:bg-[#EF535030] transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
