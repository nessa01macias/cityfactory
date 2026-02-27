import "./ui.css";
import type { ReactNode } from "react";

export type BadgeTone =
  | "idea"
  | "research"
  | "planning"
  | "testing"
  | "implementation"
  | "completed";

export function Badge({ tone, children }: { tone: BadgeTone; children: ReactNode }) {
  return <span className={`cf-badge cf-badge--${tone}`}>{children}</span>;
}

