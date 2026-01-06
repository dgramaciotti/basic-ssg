import fs from "fs";
import path from "path";
import TurndownService from "turndown";

export async function htmlToMd(inputHtmlPath: string, outputMdPath: string) {
  const html = fs.readFileSync(inputHtmlPath, "utf8");

  const turndown = new TurndownService({
    headingStyle: "atx",
    bulletListMarker: "-",
    codeBlockStyle: "fenced",
    emDelimiter: "_",
    strongDelimiter: "**",
  });

  turndown.addRule("images", {
    filter: "img",
    replacement: (_content, node: any) => {
      const src = node.getAttribute("src");
      const alt = node.getAttribute("alt") || "";
      return `![${alt}](${src})`;
    },
  });

  const markdown = turndown.turndown(html);

  fs.mkdirSync(path.dirname(outputMdPath), { recursive: true });
  fs.writeFileSync(outputMdPath, markdown.trim() + "\n");
}
