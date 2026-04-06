"use client";

import { createContext, useContext, useState } from "react";

interface AnnotationContextType {
  enabled: boolean;
  toggle: () => void;
  activePin: number | null;
  setActivePin: (n: number | null) => void;
}

const AnnotationContext = createContext<AnnotationContextType>({
  enabled: false,
  toggle: () => {},
  activePin: null,
  setActivePin: () => {},
});

export function AnnotationProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const [activePin, setActivePin] = useState<number | null>(null);
  return (
    <AnnotationContext.Provider
      value={{ enabled, toggle: () => setEnabled((v) => !v), activePin, setActivePin }}
    >
      {children}
    </AnnotationContext.Provider>
  );
}

export function useAnnotations() {
  return useContext(AnnotationContext);
}
