import buildTailwind from "./buildTailwind.js";
import { Plugin } from "../models/plugin.js";

export const tailwindPlugin = (): Plugin => ({
  name: "core-tailwind",
  setup: (cfg) => ({
    beforeBuild: [
      {
        glob: [cfg.paths.css],
        fn: buildTailwind,
      },
    ],
    afterBuild: [],
  }),
});
