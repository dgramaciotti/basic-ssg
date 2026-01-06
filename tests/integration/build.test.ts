import { it, expect, assert, describe } from "vitest";
import { build, clean, init } from "../fixtures/utils.js";
import fg from "fast-glob";
import { beforeAll } from "vitest";
import { afterAll } from "vitest";
import fs from "node:fs/promises";
import path from "node:path";

describe("correctly builds", () => {
  it("should correctly init from cli", async () => {
    await init();
    const files = await fg("pages/example-page/**");
    const templateFiles = (await fg("packages/templates/basic/**")).sort();
    const filesEqual = files.sort().every((el, idx) => {
      const fileNameEqual =
        path.basename(el) === path.basename(templateFiles[idx]);
      if (fileNameEqual) {
        return true;
      } else {
        console.log("problem...", el, templateFiles[idx]);
        return false;
      }
    });
    expect(filesEqual).toBeTruthy();
  });

  it("should build correctly", async () => {
    await build();
    const files = await fg("dist-site/example-page/**/*");

    expect(files).toContain("dist-site/example-page/index.html");
    expect(files).toContain("dist-site/example-page/sitemap.xml");
    expect(files).toContain("dist-site/example-page/output.css");

    const sitemap = await fs.readFile(
      "dist-site/example-page/sitemap.xml",
      "utf-8",
    );
    expect(sitemap).toContain("<urlset");
    expect(sitemap).toContain("http://www.sitemaps.org/schemas/sitemap/0.9");

    const css = await fs.readFile("dist-site/example-page/output.css", "utf-8");
    expect(css).toContain("tailwindcss");
  });

  it("should generate blog posts correctly", async () => {
    const blogPostPath = "dist-site/example-page/articles/example-post.html";
    const exists = await fs
      .access(blogPostPath)
      .then(() => true)
      .catch(() => false);
    expect(exists).toBe(true);

    const content = await fs.readFile(blogPostPath, "utf-8");
    expect(content).toContain("<h1>Example post</h1>");
    expect(content).toContain('<div class="article-body">');
  });

  it("should generate article index correctly with gray-matter data", async () => {
    const articleIndexPath = "dist-site/example-page/articles/index.html";
    const exists = await fs
      .access(articleIndexPath)
      .then(() => true)
      .catch(() => false);
    expect(exists).toBe(true);

    const content = await fs.readFile(articleIndexPath, "utf-8");
    // "Example Blog Post" is the title in the markdown gray-matter
    expect(content).toContain("<li>Example Blog Post</li>");
  });

  afterAll(async () => {
    await clean();
  });
});
