import fg from "fast-glob";
import path from "node:path";
import { getPageData } from "../utils/getPageData.js";
import { renderTemplate } from "../utils/renderTemplate.js";
import { AppConfig } from "../models/appConfig.js";

type BuildBlogOptions = {
  templatePath: string;
  mdPaths: string;
};

export const buildBlog = async (
  files: string[],
  cfg: AppConfig,
  options: BuildBlogOptions,
) => {
  const templates = await fg(options.templatePath, { objectMode: true });

  return Promise.all(
    templates.map(async (entry: { path: string }) => {
      const tplPath = entry.path;
      const pageDir = path.dirname(path.dirname(tplPath));
      const pageName = path.basename(pageDir);

      const postsGlob = path.join(pageDir, options.mdPaths);
      const renderedPosts = await getPageData(postsGlob);

      return Promise.all(
        renderedPosts.map((postData) => {
          const outputPath = path.join(
            cfg.paths.dist,
            pageName,
            "articles",
            `${postData.postUrl}.html`,
          );

          return renderTemplate(tplPath, outputPath, {
            post: postData.post,
            postUrl: postData.postUrl,
            postDescription: postData.postDescription,
            postName: postData.postName,
            postDate: postData.postDate,
            postTime: `${postData.postTime} minute read`,
            postAuthor: postData.postAuthor,
            coverImage: postData.coverImage,
          });
        }),
      );
    }),
  );
};
