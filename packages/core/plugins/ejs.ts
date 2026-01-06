import buildEjs from "./buildEjs.js";
import { Plugin } from "../models/plugin.js";

export const ejsPlugin = (): Plugin => ({
  name: "core-ejs",
  setup: (cfg) => ({
    beforeBuild: [
      {
        glob: [cfg.paths.base, "!**/components/**", "!**/custom/**"],
        fn: buildEjs,
      },
    ],
    afterBuild: [],
  }),
});
