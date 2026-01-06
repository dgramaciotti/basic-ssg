import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/integration/**/*.ts"],
    exclude: ["**/assets.ts", "**/blog.ts", "**/customHook.ts"],
    globals: true,
    testTimeout: 30000,
    hookTimeout: 30000,
    setupFiles: ["./tests/setup.js"],
    coverage: {
      provider: "istanbul",
      reporter: ["text", "json", "html"],
      include: ["packages/**/*.ts"],
      exclude: ["tests/**"],
    },
  },
});
