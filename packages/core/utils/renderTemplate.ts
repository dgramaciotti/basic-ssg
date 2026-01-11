import { renderFile } from "ejs";
import path from "node:path";
import { mkdir, writeFile } from "node:fs/promises";

/**
 *
 * @output Renders the template given an input and outputpath, with metadata.
 */
async function renderTemplate(
  inputPath: string,
  outputPath: string,
  data: any = {},
  replacer?: (html: string) => string,
) {
  const fileName = path.basename(outputPath, ".html");
  const renderData = { ...data, fileName };
  new Promise((res, rej) => {
    renderFile(
      inputPath,
      renderData,
      async (error: Error | null, html: string) => {
        if (error) {
          rej(error);
          return;
        }
        try {
          let replaced = replacer ? replacer(html) : html;
          const dirname = path.dirname(outputPath);
          // If theres a folder create it recursively. ex. example_folder/my_file.ejs -> dist/example_folder/my_file.html
          await mkdir(dirname, { recursive: true });
          await writeFile(outputPath, replaced, {
            encoding: "utf-8",
          });
          res(true);
          return;
        } catch (e) {
          rej(e);
          return;
        }
      },
    );
  });
}

export { renderTemplate };
