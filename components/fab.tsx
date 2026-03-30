"use client";

interface FABProps {
  onClick: () => void;
}

export function FAB({ onClick }: FABProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] pointer-events-none">
      <div className="max-w-[440px] mx-auto relative">
        <button
          onClick={onClick}
          className="absolute left-1/2 -translate-x-1/2 bottom-5 w-[54px] h-[54px] rounded-full text-[28px] font-black cursor-pointer flex items-center justify-center active:scale-95 transition-transform pointer-events-auto"
          style={{
            background: "linear-gradient(135deg, #4FC3F7, #81C784)",
            border: "3px solid #0A0A15",
            color: "#000",
            boxShadow: "0 4px 24px rgba(79, 195, 247, 0.4)",
          }}
        >
          +
        </button>
      </div>
    </div>
  );
}
