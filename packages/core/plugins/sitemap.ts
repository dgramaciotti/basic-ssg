import { buildSitemap } from "./buildSitemap.js";
import { Plugin } from "../models/plugin.js";

export const sitemapPlugin = (): Plugin => ({
  name: "core-sitemap",
  setup: (cfg) => ({
    beforeBuild: [],
    afterBuild: [
      {
        glob: [`${cfg?.paths.dist}/*`],
        fn: buildSitemap,
      },
    ],
  }),
});
