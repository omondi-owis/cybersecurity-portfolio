import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { projects } from "@/content/projects";
import { labs } from "@/content/labs";
import { articles } from "@/content/articles";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.siteUrl.replace(/\/$/, "");
  const now = new Date();
  const staticRoutes = ["", "/about", "/services", "/services/siem-wazuh-setup-tuning", "/services/linux-security-configuration-review", "/projects", "/lab", "/knowledge", "/security", "/contact", "/privacy", "/disclosure", "/resume"];
  const entries: MetadataRoute.Sitemap = staticRoutes.map(r => ({ url: `${base}${r || "/"}`, lastModified: now, changeFrequency: r === "" ? "weekly" : "monthly", priority: r === "" ? 1 : 0.7 }));
  for (const p of projects) entries.push({ url: `${base}/projects/${p.slug}`, lastModified: now, changeFrequency: "monthly", priority: 0.8 });
  for (const l of labs) entries.push({ url: `${base}/lab/${l.slug}`, lastModified: new Date(l.date), changeFrequency: "yearly", priority: 0.6 });
  for (const a of articles) entries.push({ url: `${base}/knowledge/${a.slug}`, lastModified: new Date(a.updated ?? a.date), changeFrequency: "yearly", priority: 0.6 });
  return entries;
}
