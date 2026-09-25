import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ClearCut Studio — In-Browser AI Background Remover",
    short_name: "ClearCut Studio",
    description:
      "100% private, client-side AI background removal running directly in your browser with zero server uploads.",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#2563eb",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
