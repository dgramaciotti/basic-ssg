import path from "node:path";
import { pathToFileURL } from "node:url";
import fs from "fs/promises";
import { AppConfig, Hooks, AppConfigSchema } from "./models/appConfig.js";

import { logger } from "./utils/logger.js";

const name = "pages.config.js";

export async function loadConfig(cwd = process.cwd()) {
  const fullPath = path.join(cwd, name);

  try {
    await fs.access(fullPath);

    const mod = await import(pathToFileURL(fullPath).href);

    return mod.default ?? mod;
  } catch (e) {
    logger.error("Error loading ssg config - ", e);
    return;
  }
}

export function resolveConfig(userConfig = {} as any, cwd = process.cwd()): AppConfig {
  const config = AppConfigSchema.parse(userConfig);
  
  const root = config.root;
  const outDir = config.outDir;
  const siteUrls = config.siteUrls;
  const paths = {
    root: path.join(cwd, root),
    dist: path.join(cwd, outDir),
    assets: path.join(root, "**/assets/**"),
    manifest: path.join(root, "**/site.webmanifest"),
    robots: path.join(root, "**/robots.txt"),
    base: path.join(root, "**/*.ejs"),
    css: path.join(root, "*/index.css"),
  };

  const initialConfig: AppConfig = {
    root,
    outDir,
    siteUrls,
    paths,
    hooks: { beforeBuild: [], afterBuild: [] },
    plugins: userConfig.plugins ?? [],
  };

  const allHooks: Hooks = {
    beforeBuild: [],
    afterBuild: [],
  };

  if (initialConfig.plugins) {
    for (const plugin of initialConfig.plugins) {
      const pluginHooks = plugin.setup(initialConfig);
      if (pluginHooks.beforeBuild) {
        allHooks.beforeBuild.push(...pluginHooks.beforeBuild);
      }
      if (pluginHooks.afterBuild) {
        allHooks.afterBuild.push(...pluginHooks.afterBuild);
      }
    }
  }

  if (userConfig.hooks) {
    if (userConfig.hooks.beforeBuild) {
      allHooks.beforeBuild.push(...userConfig.hooks.beforeBuild);
    }
    if (userConfig.hooks.afterBuild) {
      allHooks.afterBuild.push(...userConfig.hooks.afterBuild);
    }
  }

  return {
    ...initialConfig,
    hooks: allHooks,
  };
}
