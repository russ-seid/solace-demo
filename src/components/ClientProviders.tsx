"use client";

import { AnnotationProvider } from "@/contexts/AnnotationContext";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return <AnnotationProvider>{children}</AnnotationProvider>;
}
