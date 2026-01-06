import fs from "node:fs/promises";
import path from "node:path";
import { AppConfig } from "../models/appConfig.js";

function fileToUrl(
  file: string,
  distDir: string,
  siteUrl: string,
  basePath: string,
) {
  let rel = path.relative(distDir, file).replace(/\\/g, "/");
  rel = rel.replace(/index\.html$/, "");
  rel = rel.replace(/\.html$/, "");
  return `${siteUrl}/${basePath}/${rel}`
    .replace(/\/+/g, "/")
    .replace(/\/$/, "");
}

async function collectHtmlFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  const files = await Promise.all(
    entries.map(async (e) => {
      const full = path.join(dir, e.name);

      if (e.isDirectory()) {
        if (e.name === "assets") return [];
        return collectHtmlFiles(full);
      }

      return e.isFile() && e.name.endsWith(".html") ? [full] : [];
    }),
  );

  return files.flat();
}

export async function buildSitemap(_: string[], config?: AppConfig) {
  if (!config) return;

  const { paths, siteUrls } = config;

  const entries = await fs.readdir(paths.dist, { withFileTypes: true });

  const pageDirs = entries.filter((e) => e.isDirectory()).map((e) => e.name);

  await Promise.all(
    pageDirs.map(async (pageName) => {
      const distDir = path.join(paths.dist, pageName);
      const siteUrl = siteUrls[pageName];
      if (!siteUrl) return;

      const htmlFiles = await collectHtmlFiles(distDir);
      if (!htmlFiles.length) return;

      const urls = await Promise.all(
        htmlFiles.map(async (file) => {
          const stat = await fs.stat(file);
          return `<url><loc>${fileToUrl(
            file,
            distDir,
            siteUrl,
            pageName,
          )}</loc><lastmod>${
            stat.mtime.toISOString().split("T")[0]
          }</lastmod></url>`;
        }),
      );

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("")}
</urlset>`;

      await fs.writeFile(path.join(distDir, "sitemap.xml"), xml);
    }),
  );
}
