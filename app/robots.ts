import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: "https://clear-cut.arifjahan.com/sitemap.xml",
    host: "https://clear-cut.arifjahan.com",
  };
}
