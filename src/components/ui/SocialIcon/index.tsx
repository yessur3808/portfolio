import type { SVGProps } from "react";

import { Mail } from "lucide-react";

import type { ContactLink } from "@/app/(site)/_types/portfolio";
import { cn } from "@/src/lib/utils";

type SocialIconVariant = "subtle" | "brand";

type SocialIconProps = {
  icon: ContactLink["icon"];
  variant?: SocialIconVariant;
  className?: string;
} & Omit<SVGProps<SVGSVGElement>, "children">;

const variantByIcon: Record<
  ContactLink["icon"],
  Record<SocialIconVariant, string>
> = {
  mail: {
    subtle: "text-[color:var(--text-muted)]",
    brand: "text-[color:var(--accent-cyan)]",
  },
  github: {
    subtle: "text-[color:var(--text-muted)]",
    brand: "text-[color:var(--text-main)]",
  },
  linkedin: {
    subtle: "text-[color:var(--text-muted)]",
    brand: "text-[#60A5FA]",
  },
  portfolio: {
    subtle: "text-[color:var(--text-muted)]",
    brand: "text-[#A78BFA]",
  },
};

const iconStyles = (icon: ContactLink["icon"], variant: SocialIconVariant, className?: string) => {
  return cn("h-4 w-4 shrink-0", variantByIcon[icon][variant], className);
};

const GithubGlyph = ({ className, ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path d="M12 2c-5.52 0-10 4.57-10 10.22 0 4.52 2.87 8.36 6.84 9.72.5.1.68-.22.68-.5 0-.24-.01-1.04-.02-1.89-2.78.62-3.37-1.2-3.37-1.2-.46-1.2-1.12-1.52-1.12-1.52-.92-.64.07-.63.07-.63 1.01.08 1.55 1.08 1.55 1.08.91 1.59 2.39 1.13 2.97.86.09-.68.36-1.14.65-1.4-2.22-.26-4.56-1.15-4.56-5.14 0-1.14.39-2.06 1.04-2.79-.11-.26-.45-1.31.1-2.72 0 0 .84-.28 2.75 1.07A9.32 9.32 0 0 1 12 7.3c.85 0 1.7.12 2.5.37 1.9-1.35 2.74-1.07 2.74-1.07.55 1.41.21 2.46.1 2.72.64.73 1.03 1.66 1.03 2.79 0 4-2.34 4.87-4.58 5.13.37.34.69.98.69 1.99 0 1.44-.02 2.6-.02 2.96 0 .28.18.61.69.5A10.27 10.27 0 0 0 22 12.22C22 6.57 17.52 2 12 2Z" />
    </svg>
  );
};

const LinkedinGlyph = ({ className, ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path d="M6.74 8.63a1.74 1.74 0 1 1 0-3.49 1.74 1.74 0 0 1 0 3.49ZM5.23 9.97h3.01V19H5.23V9.97Zm4.89 0h2.88v1.23h.04c.4-.76 1.38-1.56 2.83-1.56 3.02 0 3.58 2.03 3.58 4.67V19h-3v-4.16c0-.99-.02-2.27-1.35-2.27-1.35 0-1.56 1.08-1.56 2.2V19h-3.01V9.97Z" />
    </svg>
  );
};

const PortfolioGlyph = ({ className, ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path d="M8 7h8" />
      <path d="M12 7v10" />
      <rect x="3.5" y="5" width="17" height="14" rx="2.5" />
      <path d="M3.5 10.5h17" />
    </svg>
  );
};

export const SocialIcon = (
  {
    icon,
    variant = "brand",
    className,
    ...props
  }: SocialIconProps,
) => {
  if (icon === "mail") {
    return (
      <Mail
        aria-hidden="true"
        className={iconStyles(icon, variant, className)}
        {...props}
      />
    );
  }

  if (icon === "github") {
    return (
      <GithubGlyph
        className={iconStyles(icon, variant, className)}
        {...props}
      />
    );
  }

  if (icon === "linkedin") {
    return (
      <LinkedinGlyph
        className={iconStyles(icon, variant, className)}
        {...props}
      />
    );
  }

  return (
    <PortfolioGlyph
      className={iconStyles(icon, variant, className)}
      {...props}
    />
  );
};
