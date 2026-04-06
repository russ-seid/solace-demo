"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAnnotations } from "@/contexts/AnnotationContext";

interface AnnotationPinProps {
  number: number;
  text: string;
}

const TOOLTIP_WIDTH = 256;
const TOOLTIP_GAP = 10;
const VIEWPORT_PADDING = 8;
// Rough max height of a tooltip (enough for ~4 lines of text + header)
const ESTIMATED_HEIGHT = 120;

function computeTooltipStyle(pinRect: DOMRect): React.CSSProperties {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // Horizontal: center on pin, clamp so it stays within the viewport
  const rawLeft = pinRect.left + pinRect.width / 2 - TOOLTIP_WIDTH / 2;
  const left = Math.max(
    VIEWPORT_PADDING,
    Math.min(rawLeft, vw - TOOLTIP_WIDTH - VIEWPORT_PADDING)
  );

  // Vertical: prefer above, flip below if there isn't enough room
  const spaceAbove = pinRect.top - TOOLTIP_GAP;
  const showBelow = spaceAbove < ESTIMATED_HEIGHT;

  if (showBelow) {
    const top = Math.min(pinRect.bottom + TOOLTIP_GAP, vh - ESTIMATED_HEIGHT - VIEWPORT_PADDING);
    return { position: "fixed", top, left, width: TOOLTIP_WIDTH, zIndex: 9999, pointerEvents: "none" };
  }

  return {
    position: "fixed",
    top: pinRect.top - TOOLTIP_GAP,
    left,
    width: TOOLTIP_WIDTH,
    zIndex: 9999,
    pointerEvents: "none",
    transform: "translateY(-100%)",
  };
}

export default function AnnotationPin({ number, text }: AnnotationPinProps) {
  const { activePin, setActivePin } = useAnnotations();
  const [hovered, setHovered] = useState(false);
  const [pinRect, setPinRect] = useState<DOMRect | null>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  const isActive = activePin === number;
  const showTooltip = hovered || isActive;

  // When activated from the HUD legend, measure position
  useEffect(() => {
    if (isActive && pinRef.current) {
      setPinRect(pinRef.current.getBoundingClientRect());
    }
  }, [isActive]);

  function handleMouseEnter() {
    if (pinRef.current) setPinRect(pinRef.current.getBoundingClientRect());
    setHovered(true);
  }

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setActivePin(isActive ? null : number);
  }

  const tooltip =
    showTooltip && pinRect && typeof document !== "undefined"
      ? createPortal(
          <div style={computeTooltipStyle(pinRect)}>
            <div
              className="rounded-xl px-5 py-4 text-[12.5px] leading-[1.65] border"
              style={{
                backgroundColor: "#FFF7E9",
                color: "#232323",
                borderColor: "#f0ddb8",
                boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
              }}
            >
              <span
                className="font-bold block mb-1 text-[11px] uppercase tracking-widest"
                style={{ color: "#285e50" }}
              >
                Annotation {number}
              </span>
              {text}
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <div
        ref={pinRef}
        className="shrink-0"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setHovered(false)}
        onClick={handleClick}
      >
        <div
          className="w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-bold cursor-pointer select-none transition-all"
          style={{
            backgroundColor: showTooltip ? "#1a3d35" : "#285e50",
            color: "white",
            boxShadow: showTooltip ? "0 0 0 3px rgba(40,94,80,0.2)" : "none",
          }}
        >
          {number}
        </div>
      </div>
      {tooltip}
    </>
  );
}
