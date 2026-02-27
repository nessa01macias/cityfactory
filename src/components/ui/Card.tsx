import "./ui.css";
import type { CSSProperties, ReactNode } from "react";

export function Card({
  children,
  className,
  style
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return <div className={`cf-card${className ? ` ${className}` : ""}`} style={style}>{children}</div>;
}

