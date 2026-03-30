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
    }
  }, [confirmDeleteId, deleteEvent]);

  const lastUpdate = events.length > 0 ? events[0].date_time : null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">🌙</div>
          <div className="text-sm text-[#555]">Cargando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen relative pb-[90px]">
      <Header lastUpdate={lastUpdate} isLive={true} />

      <div className="px-4">
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
      </div>

      <FAB onClick={() => handleOpenModal("feed")} />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {showModal && (
        <AddEventModal
          onClose={() => setShowModal(false)}
          onSave={addEvent}
          initialType={modalInitialType}
        />
      )}

      {/* Confirm Delete Modal */}
      {confirmDeleteId && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: "#000a" }}
        >
          <div
            className="rounded-2xl p-6 w-72 text-center"
            style={{ background: "#1A1A2E", border: "1px solid #2A2A4E" }}
          >
            <div className="text-lg font-extrabold mb-2">Eliminar registro?</div>
            <div className="text-sm text-[#888] mb-5">
              Esta accion no se puede deshacer
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 py-3 rounded-xl text-sm font-bold cursor-pointer"
                style={{
                  background: "#0D0D1A",
                  border: "1px solid #2A2A3E",
                  color: "#888",
                }}
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-3 rounded-xl text-sm font-bold cursor-pointer"
                style={{
                  background: "#EF535020",
                  border: "1px solid #EF535040",
                  color: "#EF5350",
                }}
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
