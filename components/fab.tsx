"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface FABProps {
  onClick: () => void;
}

export function FAB({ onClick }: FABProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] pointer-events-none">
      <div className="max-w-[440px] mx-auto relative">
        <Button
          onClick={onClick}
          className="absolute left-1/2 -translate-x-1/2 bottom-5 size-[54px] rounded-full text-lg font-black pointer-events-auto active:scale-95 transition-transform bg-gradient-to-br from-primary to-baby-green border-[3px] border-background text-background shadow-[0_4px_24px_rgba(79,195,247,0.4)] hover:opacity-90"
          size="icon-lg"
        >
          <Plus className="size-7" />
        </Button>
      </div>
    </div>
  );
}
