import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/register", "/login"],
        disallow: ["/dashboard/", "/api/"],
      },
    ],
    sitemap: "https://featseo.com/sitemap.xml",
  };
}
