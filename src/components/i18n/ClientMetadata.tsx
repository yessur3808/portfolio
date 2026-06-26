"use client";

import { useEffect } from "react";

type ClientMetadataProps = {
  title: string;
  description: string;
};

export const ClientMetadata = ({ title, description }: ClientMetadataProps) => {
  useEffect(() => {
    document.title = title;

    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }

    meta.setAttribute("content", description);
  }, [description, title]);

  return null;
};
