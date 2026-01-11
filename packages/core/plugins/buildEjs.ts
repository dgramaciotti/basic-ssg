import path from "path";
import fs from "fs/promises";
import { renderTemplate } from "../utils/renderTemplate.js";
import { globalReplacer } from "../utils/globalReplacer.js";
import { AppConfig } from "../models/appConfig.js";

async function buildEjs(files: string[], cfg: AppConfig) {
  await Promise.all(
    files.map(async (filePath) => {
      const outPath = path
        .join(cfg.paths.dist, filePath.replace(/^pages\//, ""))
        .replace(/\.ejs$/, ".html");

      return await renderTemplate(filePath, outPath, {}, globalReplacer);
    }),
  );
}

export default buildEjs;
