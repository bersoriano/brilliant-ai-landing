"use client";
import { createContext, useContext, useState, type ReactNode } from "react";
import type { Workflow } from "@/lib/workflows";
type SectorHint = { sector: string; at: number } | null;
const InquiryContext = createContext<{
  selectedWorkflow: Workflow | null;
  selectWorkflow: (workflow: Workflow | null) => void;
  /** Pre-selects the form's sector (e.g. "other" from the Solutions link). */
  sectorHint: SectorHint;
  hintSector: (sector: string) => void;
} | null>(null);
/** Keeps the selected example and contact form together without navigation or storage. */
export function InquiryProvider({ children }: { children: ReactNode }) {
  const [selectedWorkflow, selectWorkflow] = useState<Workflow | null>(null);
  const [sectorHint, setSectorHint] = useState<SectorHint>(null);
  return (
    <InquiryContext.Provider
      value={{
        selectedWorkflow,
        selectWorkflow,
        sectorHint,
        hintSector: (sector) => setSectorHint({ sector, at: Date.now() }),
      }}
    >
      {children}
    </InquiryContext.Provider>
  );
}
export function useInquiry() {
  const context = useContext(InquiryContext);
  if (!context)
    throw new Error("useInquiry must be used within InquiryProvider");
  return context;
}
