import { describe, it, expect } from "vitest";
import { execSync } from "node:child_process";
import path from "node:path";
import fs from "node:fs";

describe("NPM Publish Dry Run", () => {
  const packagesDir = path.join(process.cwd(), "packages");
  const workspacePackages = fs.readdirSync(packagesDir)
    .filter(f => fs.statSync(path.join(packagesDir, f)).isDirectory())
    .filter(f => fs.existsSync(path.join(packagesDir, f, "package.json")));

  it("should succeed dry-run publish for the root package", () => {
    expect(() => {
      execSync("npx pnpm publish --dry-run --no-git-checks", { stdio: "pipe" });
    }).not.toThrow();
  });

  workspacePackages.forEach(pkg => {
    it(`should succeed dry-run publish for @basic-ssg/${pkg}`, () => {
      const pkgPath = path.join(packagesDir, pkg);
      expect(() => {
        execSync("npx pnpm publish --dry-run --no-git-checks", { 
          cwd: pkgPath,
          stdio: "pipe" 
        });
      }).not.toThrow();
    });
  });
});
