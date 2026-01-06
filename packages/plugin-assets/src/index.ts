import path from "path";
import fs from "fs/promises";
import sharp from "sharp";
import type { AppConfig } from "@basic-ssg/core/models/appConfig";
import type { Plugin } from "@basic-ssg/core/models/plugin";

const RASTER_IMAGE_REGEX = /\.(jpe?g|png|tiff?|gif)$/i;
const COPY_IMAGE_REGEX = /\.(svg|webp|avif)$/i;

async function copyAssets(files: string[], cfg: AppConfig) {
  await fs.mkdir(cfg.paths.dist, { recursive: true });

  await Promise.all(
    files.map(async (filePath) => {
      // ignore already-built assets
      if (filePath.includes(`${path.sep}${cfg.paths.dist}${path.sep}`)) return;

      const ext = path.extname(filePath);

      // pages/example-page/assets/x.png -> example-page/assets/x.png
      const rel = path.relative(cfg.paths.root, filePath);

      // dist-site/example-page/assets/x.png
      let outPath = path.join(cfg.paths.dist, rel);

      await fs.mkdir(path.dirname(outPath), { recursive: true });

      if (COPY_IMAGE_REGEX.test(ext)) {
        await fs.copyFile(filePath, outPath);
        return;
      }

      if (RASTER_IMAGE_REGEX.test(ext)) {
        const buffer = await sharp(await fs.readFile(filePath))
          .resize({ width: 1200, withoutEnlargement: true })
          .webp({ quality: 75, effort: 4 })
          .toBuffer();

        outPath = outPath.replace(ext, ".webp");
        await fs.writeFile(outPath, buffer);
        return;
      }

      await fs.copyFile(filePath, outPath);
    }),
  );
}

export const assetsPlugin = (): Plugin => ({
  name: "core-assets",
  setup: (cfg) => ({
    beforeBuild: [
      {
        glob: [cfg.paths.assets, cfg.paths.manifest, cfg.paths.robots],
        fn: copyAssets,
      },
    ],
    afterBuild: [],
  }),
});
