import path from "path";
import fs from "fs/promises";

import { AppConfig } from "../models/appConfig.js";

import postcss from "postcss";
import tailwind from "@tailwindcss/postcss";
import { readFile } from "node:fs/promises";

async function buildTailwind(files: string[], cfg: AppConfig) {
  try {
    await Promise.all(
      files.map(async (inputCss) => {
        const rel = inputCss.replace(/^pages\//, "");
        const page = rel.split("/")[0];
        const outputCss = path.join(cfg.paths.dist, page, "output.css");

        await fs.mkdir(path.dirname(outputCss), { recursive: true });
        const processor = postcss([tailwind({ optimize: true })]);
        const css = await readFile(inputCss, { encoding: "utf-8" });
        const result = await processor.process(css, {
          from: inputCss,
          to: outputCss,
        });

        await fs.writeFile(outputCss, result.css);
      }),
    );
  } catch (e) {
    console.error("Error executing tailwind command - ", e);
  }
}

export default buildTailwind;
