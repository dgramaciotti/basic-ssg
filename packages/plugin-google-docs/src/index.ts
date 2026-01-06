import { configDotenv } from "dotenv";
import path from "path";
import fs from "fs";
import { authenticateGoogle } from "./utils/authenticateGoogle.js";
import { downloadGoogleDocs } from "./utils/downloadGoogleDocs.js";
import { docToHtml } from "./utils/docToHtml.js";
import { htmlToMd } from "./utils/htmlToMd.js";
import type { Plugin } from "@basic-ssg/core/models/plugin";

type GoogleDocsPluginOptions = {
  pageName: string;
  skip?: boolean;
};

export const googleDocsPlugin = (options: GoogleDocsPluginOptions): Plugin => ({
  name: "core-google-docs",
  setup: (cfg) => {
    const syncWithGoogleDocs = async () => {
      if (options.skip) {
        return;
      }
      configDotenv();

      const { pageName } = options;
      const root = process.cwd();
      const htmlIntermediate = path.join(root, "temp");
      const mdOutput = path.join(root, `pages/${pageName}/posts`);
      const imagesDist = path.join(root, `pages/${pageName}/assets`);

      fs.mkdirSync(htmlIntermediate, { recursive: true });
      fs.mkdirSync(mdOutput, { recursive: true });
      fs.mkdirSync(imagesDist, { recursive: true });

      const drive = await authenticateGoogle();

      const files = await downloadGoogleDocs(
        drive,
        process.env.BLOG_FOLDER_ID as string,
      );

      const names = files.map((f) => path.basename(f, ".docx"));

      await Promise.all(
        files.map((filePath) => {
          const name = path.basename(filePath, ".docx");
          const htmlOut = path.join(htmlIntermediate, `${name}.html`);
          return docToHtml(filePath, htmlOut, imagesDist);
        }),
      );

      await Promise.all(
        names.map((name) => {
          const htmlIn = path.join(htmlIntermediate, `${name}.html`);
          const mdOut = path.join(mdOutput, `${name}.md`);
          return htmlToMd(htmlIn, mdOut);
        }),
      );
    };

    return {
      beforeBuild: [],
      afterBuild: [
        {
          glob: [],
          fn: syncWithGoogleDocs,
        },
      ],
    };
  },
});
