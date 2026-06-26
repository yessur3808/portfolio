import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

import { cn } from "@/src/lib/utils";

type Variant = "primary" | "secondary" | "ghost";

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  external?: boolean;
};

type AnchorButtonProps = CommonProps &
  Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    "children" | "className" | "href"
  > & {
    href: string;
  };

type NativeButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className"> & {
    href?: undefined;
  };

export type ButtonProps = AnchorButtonProps | NativeButtonProps;

const baseStyles =
  "glass-pill inline-flex min-h-11 items-center justify-center rounded-full border px-4.5 py-2.5 text-[13px] font-semibold tracking-[0.02em] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4FC3F7] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E2A47] disabled:cursor-not-allowed disabled:opacity-50";

const variantStyles: Record<Variant, string> = {
  primary:
    "glass-surface glass-strong border-[#4FC3F7]/55 bg-gradient-to-r from-[#4FC3F7]/88 to-[#8A6CFF]/82 text-[#0E2A47] shadow-[0_12px_28px_rgb(2_6_23/0.52),0_0_30px_rgb(79_195_247/0.24)] hover:from-[#4FC3F7] hover:to-[#8A6CFF]/92 hover:shadow-[0_14px_30px_rgb(2_6_23/0.6),0_0_34px_rgb(138_108_255/0.32)]",
  secondary:
    "glass-surface glass-strong border-[#1F446C]/80 bg-[#0E2A47]/54 text-[#4FC3F7] hover:border-[#8A6CFF] hover:bg-[#8A6CFF]/16",
  ghost:
    "glass-surface glass-strong border-[#1F446C]/65 bg-transparent text-slate-300 hover:border-[#8A6CFF]/70 hover:bg-[#0E2A47]/62 hover:text-[#4FC3F7]",
};

function sanitizeHref(href: string) {
  const cleanedHref = href.trim().replace(/[\u0000-\u001F\u007F]/g, "");

  if (!cleanedHref) {
    return "#";
  }

  const lowerHref = cleanedHref.toLowerCase();

  if (
    lowerHref.startsWith("javascript:") ||
    lowerHref.startsWith("data:") ||
    lowerHref.startsWith("vbscript:")
  ) {
    return "#";
  }

  return cleanedHref;
}

export function Button({
  children,
  variant = "primary",
  className,
  external = false,
  ...props
}: ButtonProps) {
  const styles = cn(baseStyles, variantStyles[variant], className);

  if ("href" in props && typeof props.href === "string") {
    const { href, target, rel, ...restLinkProps } = props;
    const safeHref = sanitizeHref(href);

    return (
      <a
        {...restLinkProps}
        href={safeHref}
        className={styles}
        target={external ? "_blank" : target}
        rel={external ? "noopener noreferrer" : rel}
      >
        {children}
      </a>
    );
  }

  const { type, ...restButtonProps } = props;

  return (
    <button {...restButtonProps} className={styles} type={type ?? "button"}>
      {children}
    </button>
  );
}
