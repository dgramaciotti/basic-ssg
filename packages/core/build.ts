import fg from "fast-glob";
import { AppConfig } from "./models/appConfig.js";
import timed from "./utils/timed.js";

import { logger } from "./utils/logger.js";

async function build(cfg: AppConfig) {
  const totalStart = performance.now();
  logger.info("Build start");
  await Promise.all(
    cfg.hooks.beforeBuild.map(async (hook) => {
      return timed(hook.fn.name, async () => {
        const files = hook.glob.length !== 0 ? await fg(hook.glob) : [];
        await hook.fn(files, cfg);
      });
    }),
  );
  await Promise.all(
    cfg.hooks.afterBuild.map(async (hook) => {
      return timed(hook.fn.name, async () => {
        const files = hook.glob.length !== 0 ? await fg(hook.glob) : [];
        await hook.fn(files, cfg);
      });
    }),
  );

  logger.info(`Build done: ${(performance.now() - totalStart).toFixed(1)}ms\n`);
}

export default build;
