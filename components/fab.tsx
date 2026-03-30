"use client";

interface FABProps {
  onClick: () => void;
}

export function FAB({ onClick }: FABProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-[440px] mx-auto pointer-events-none z-[65]">
      <button
        onClick={onClick}
        className="absolute left-1/2 -translate-x-1/2 w-[52px] h-[52px] rounded-full text-[26px] font-black cursor-pointer flex items-center justify-center active:scale-[0.93] transition-transform pointer-events-auto"
        style={{
          bottom: "32px",
          background: "linear-gradient(135deg, #4FC3F7, #81C784)",
          border: "3px solid #0A0A15",
          color: "#000",
          boxShadow: "0 4px 20px #4FC3F760",
        }}
      >
        +
      </button>
    </div>
  );
}
