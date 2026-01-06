#!/usr/bin/env node
import process from "node:process";
import chokidar from "chokidar";
import build from "../core/build.js";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { logger } from "../core/utils/logger.js";
import { loadConfig, resolveConfig } from "../core/config.js";
import { AppConfig } from "../core/models/appConfig.js";

async function init() {
  const cwd = process.cwd();

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const templateDir = path.resolve(__dirname, "../templates/basic");
  const targetDir = path.join(cwd, "pages");

  await fs.mkdir(targetDir, { recursive: true });

  const entries = await fs.readdir(templateDir, { withFileTypes: true });

  for (const entry of entries) {
    const src = path.join(templateDir, entry.name);
    const dest = path.join(targetDir, entry.name);

    await fs.cp(src, dest, {
      recursive: true,
      errorOnExist: true,
    });
  }

  // Create pages.config.js if it doesn't exist
  const configPath = path.join(cwd, "pages.config.js");
  try {
    await fs.access(configPath);
    logger.info("pages.config.js already exists");
  } catch {
    const templateConfigPath = path.join(__dirname, "../templates/config/pages.config.js");
    try {
        await fs.copyFile(templateConfigPath, configPath);
        logger.info("Created pages.config.js");
    } catch (e) {
        logger.warn("Could not create pages.config.js template", e);
    }
  }

  logger.info("✅ Project initialized in ./pages/example-page");
}

async function buildOnce(cfg: AppConfig) {
  await build(cfg);
}

async function watch(cfg: AppConfig) {
  await build(cfg);

  const watcher = chokidar.watch("pages", {
    ignoreInitial: true,
    persistent: true,
    awaitWriteFinish: {
      stabilityThreshold: 100,
      pollInterval: 50,
    },
  });

  watcher.on("all", async () => {
    try {
      await build(cfg);
    } catch (err) {
      logger.error(err);
    }
  });
}

function printHelp() {
  console.log(`
basic-ssg

Usage:
  basic-ssg init
  basic-ssg build [--watch]

Commands:
  init        Initialize a new project
  build       Build the site
  --watch     Watch files and rebuild on change
`);
}

async function main() {
  const args = process.argv.slice(2);

  const command = args[0];
  const watchFlag = args.includes("--watch");

  if (watchFlag) {
    process.env.SSG_WATCH_MODE = "true";
  }

  const userConfig = await loadConfig();

  try {
    switch (command) {
      case "init":
        await init();
        break;

      case "build": {
        const cfg = await resolveConfig(userConfig);
        if (watchFlag) {
          await watch(cfg);
        } else {
          await buildOnce(cfg);
        }
        break;
      }

      case undefined:
      case "help":
      case "--help":
      case "-h":
        printHelp();
        break;

      default:
        logger.error(`Unknown command: ${command}`);
        printHelp();
        process.exit(1);
    }
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
}

main();
