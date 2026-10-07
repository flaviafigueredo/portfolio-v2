import type { MetadataRoute } from "next";
import { siteUrl } from "@/content/siteContent";

export const dynamic = "force-static";

// Libera a home para o Google e esconde as páginas de teste em /lab.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/lab/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
