"use client";

import type { ContactLink } from "@/app/(site)/_types/portfolio";

import { trackEvent } from "@/src/lib/analytics";
import { SocialIcon } from "@/src/components/ui/SocialIcon";

type SocialLocation = "about" | "contact" | "footer";

type TrackedSocialLinkProps = {
  link: ContactLink;
  location: SocialLocation;
  className: string;
  iconVariant?: "subtle" | "brand";
  iconClassName?: string;
  showLabel?: boolean;
  ariaLabel?: string;
};

export const TrackedSocialLink = ({
  link,
  location,
  className,
  iconVariant = "subtle",
  iconClassName,
  showLabel = true,
  ariaLabel,
}: TrackedSocialLinkProps) => {
  return (
    <a
      href={link.href}
      target={link.external ? "_blank" : undefined}
      rel={link.external ? "noopener noreferrer" : undefined}
      aria-label={ariaLabel ?? link.label}
      onClick={() => {
        trackEvent("social_click", {
          social_id: link.id,
          social_label: link.label,
          location,
          button_id: `social_${link.id}`,
          button_label: link.label,
          button_location: `${location}_social_links`,
          href: link.href,
        });

        if (
          link.id === "email" ||
          link.id === "linkedin" ||
          link.id === "github"
        ) {
          trackEvent("contact_click", {
            contact_type: link.id,
            button_id: `contact_${link.id}`,
            button_label: link.label,
            button_location: `${location}_social_links`,
          });
        }
      }}
      className={className}
    >
      <SocialIcon
        icon={link.icon}
        variant={iconVariant}
        className={iconClassName}
      />
      {showLabel ? <span>{link.label}</span> : null}
    </a>
  );
};
