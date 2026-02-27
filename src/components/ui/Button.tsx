import { Link } from "react-router-dom";
import "./ui.css";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "white";

type BaseProps = {
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  className,
  children,
  ...rest
}: BaseProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  const v = variant === "primary" ? "" : ` cf-btn--${variant}`;
  return (
    <button className={`cf-btn${v}${className ? ` ${className}` : ""}`} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  to,
  variant = "primary",
  className,
  children,
  ...rest
}: BaseProps & { to: string } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const v = variant === "primary" ? "" : ` cf-btn--${variant}`;
  return (
    <Link className={`cf-btn${v}${className ? ` ${className}` : ""}`} to={to} {...rest}>
      {children}
    </Link>
  );
}

