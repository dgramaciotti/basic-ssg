import { z } from "zod";
import { Plugin } from "./plugin.js";

export const AppConfigSchema = z.object({
  root: z.string().default("pages"),
  outDir: z.string().default("dist-site"),
  siteUrls: z.record(z.string(), z.string()).default({}),
  plugins: z.array(z.any()).optional().default([]),
  hooks: z
    .object({
      beforeBuild: z.array(z.any()).default([]),
      afterBuild: z.array(z.any()).default([]),
    })
    .optional()
    .default({ beforeBuild: [], afterBuild: [] }),
});

export type AppConfig = z.infer<typeof AppConfigSchema> & {
  paths: {
    root: string;
    dist: string;
    assets: string;
    manifest: string;
    robots: string;
    base: string;
    css: string;
  };
  plugins?: Plugin[];
};

export type Hooks = {
  beforeBuild: {
    glob: string[];
    fn: (files: string[], cfg: AppConfig) => void;
  }[];
  afterBuild: {
    glob: string[];
    fn: (files: string[], cfg: AppConfig) => void;
  }[];
};
