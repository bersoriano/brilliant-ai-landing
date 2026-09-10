"use client";
import { createContext, useContext, useState, type ReactNode } from "react";
import type { Workflow } from "@/lib/workflows";
const InquiryContext = createContext<{
  selectedWorkflow: Workflow | null;
  selectWorkflow: (workflow: Workflow | null) => void;
} | null>(null);
/** Keeps the selected example and contact form together without navigation or storage. */
export function InquiryProvider({ children }: { children: ReactNode }) {
  const [selectedWorkflow, selectWorkflow] = useState<Workflow | null>(null);
  return (
    <InquiryContext.Provider value={{ selectedWorkflow, selectWorkflow }}>
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
