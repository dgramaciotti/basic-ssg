// should have a cleanup function, to clear everything (perhaps calling the terminal utils for that)
// Should have an utility to build (cleaning up before in the process)

import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

export async function setup() {
  const command = `npm run build:typescript`;
  return execAsync(command);
}

export async function build() {
  const command = `basic-ssg build`;
  return execAsync(command);
}

export async function init() {
  const command = `basic-ssg init`;
  return execAsync(command);
}

export async function clean() {
  const command = `npm run clean`;
  return execAsync(command);
}
