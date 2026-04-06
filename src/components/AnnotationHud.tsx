"use client";

import { useAnnotations } from "@/contexts/AnnotationContext";

export interface AnnotationEntry {
  number: number;
  label: string;
}

export default function AnnotationHud({ annotations }: { annotations: AnnotationEntry[] }) {
  const { enabled, toggle, activePin, setActivePin } = useAnnotations();

  function handleLegendClick(n: number) {
    setActivePin(activePin === n ? null : n);
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5 z-[200]">
      {/* Legend panel — visible when enabled */}
      {enabled && (
        <div
          className="rounded-xl px-4 py-3.5 flex flex-col gap-1 w-[272px] border"
          style={{
            backgroundColor: "white",
            borderColor: "#e5e5e5",
            boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
          }}
        >
          <span className="text-[10px] font-bold text-[#285e50] uppercase tracking-widest mb-1.5">
            Design Annotations
          </span>
          {annotations.map((a) => {
            const isActive = activePin === a.number;
            return (
              <button
                key={a.number}
                onClick={() => handleLegendClick(a.number)}
                className="flex items-start gap-2.5 w-full text-left rounded-lg px-2 py-2 -mx-2 transition-colors cursor-pointer"
                style={{
                  backgroundColor: isActive ? "#FFF7E9" : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = "#f9f9f9";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = isActive ? "#FFF7E9" : "transparent";
                }}
              >
                <div
                  className="w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-px transition-colors"
                  style={{
                    backgroundColor: isActive ? "#1a3d35" : "#285e50",
                    color: "white",
                    boxShadow: isActive ? "0 0 0 3px rgba(40,94,80,0.2)" : "none",
                  }}
                >
                  {a.number}
                </div>
                <span
                  className="text-[12.5px] leading-[1.45] transition-colors"
                  style={{ color: isActive ? "#1a3d35" : "#232323", fontWeight: isActive ? 600 : 400 }}
                >
                  {a.label}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={toggle}
        className="flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-bold transition-all cursor-pointer"
        style={{
          backgroundColor: enabled ? "#285e50" : "white",
          color: enabled ? "white" : "#285e50",
          border: `1.5px solid ${enabled ? "#285e50" : "#c8ddd9"}`,
          boxShadow: enabled
            ? "0 4px 16px rgba(40,94,80,0.3)"
            : "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        Annotations
      </button>
    </div>
  );
}
