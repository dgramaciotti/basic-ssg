import { logger } from "./logger.js";

async function timed(name: string, fn: () => Promise<void>) {
  const s = performance.now();
  await fn();
  const e = performance.now();
  logger.info(`${name}: ${(e - s).toFixed(1)}ms`);
}

export default timed;
