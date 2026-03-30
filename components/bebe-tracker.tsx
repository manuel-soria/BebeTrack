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
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogMedia,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

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
      toast.success("Registro eliminado");
    }
  }, [confirmDeleteId, deleteEvent]);

  const handleSave = useCallback(async (event: Parameters<typeof addEvent>[0]) => {
    await addEvent(event);
    toast.success("Guardado correctamente");
  }, [addEvent]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 w-full max-w-[280px]">
          <Skeleton className="size-16 rounded-2xl" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-48" />
          <div className="w-full flex flex-col gap-3 mt-4">
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
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

      {/* Confirm Delete AlertDialog */}
      <AlertDialog open={!!confirmDeleteId} onOpenChange={(open) => !open && setConfirmDeleteId(null)}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10">
              <Trash2 className="text-destructive" />
            </AlertDialogMedia>
            <AlertDialogTitle>Eliminar registro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta accion no se puede deshacer
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmDelete}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
