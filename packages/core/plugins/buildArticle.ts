import fg from "fast-glob";
import path from "node:path";
import { getPageData } from "../utils/getPageData.js";
import { renderTemplate } from "../utils/renderTemplate.js";
import { AppConfig } from "../models/appConfig.js";

type BuildArticleOptions = {
  articlePath: string;
  mdPaths: string;
};

export const buildArticle = async (
  files: string[],
  cfg: AppConfig,
  options: BuildArticleOptions,
) => {
  const templates = await fg(options.articlePath, { objectMode: true });

  return Promise.all(
    templates.map(async (entry: { path: string }) => {
      const tplPath = entry.path;
      const pageDir = path.dirname(path.dirname(tplPath));
      const pageName = path.basename(pageDir);

      const outputPath = path.join(
        cfg.paths.dist,
        pageName,
        "articles",
        "index.html",
      );

      const postsGlob = path.join(pageDir, options.mdPaths);
      const renderedPosts = await getPageData(postsGlob);

      return renderTemplate(tplPath, outputPath, {
        articles: renderedPosts,
      });
    }),
  );
};
