import { z } from "zod";

export const ConfigSchema = z.object({
  root: z.string().optional(),
  outDir: z.string().optional(),
  siteUrls: z.record(z.string(), z.string()).optional(),
  plugins: z.array(z.any()).optional(),
  hooks: z
    .object({
      beforeBuild: z
        .array(
          z.object({
            glob: z.array(z.string()),
            fn: z.function(),
          }),
        )
        .optional(),
      afterBuild: z
        .array(
          z.object({
            glob: z.array(z.string()),
            fn: z.function(),
          }),
        )
        .optional(),
    })
    .optional(),
});

export type UserConfig = z.infer<typeof ConfigSchema>;
