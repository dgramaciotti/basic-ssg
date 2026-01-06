import path from "path";
import fs from "fs/promises";
import execAsync from "../utils/execAsync.js";

import { resolve } from "node:path";
import { AppConfig } from "../models/appConfig.js";

const bin = resolve(process.cwd(), "node_modules/.bin/tailwindcss");

async function buildTailwind(files: string[], cfg: AppConfig) {
  try {
    await Promise.all(
      files.map(async (inputCss) => {
        const rel = inputCss.replace(/^pages\//, "");
        const page = rel.split("/")[0];
        const outputCss = path.join(cfg.paths.dist, page, "output.css");

        await fs.mkdir(path.dirname(outputCss), { recursive: true });
        await execAsync(`${bin} -i "${inputCss}" -o "${outputCss}" --minify`);
      }),
    );
  } catch (e) {
    console.error("Error executing tailwind command - ", e);
  }
}

export default buildTailwind;
