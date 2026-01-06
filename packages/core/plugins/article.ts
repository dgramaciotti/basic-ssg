import { buildArticle } from "./buildArticle.js";
import { Plugin } from "../models/plugin.js";
import { AppConfig } from "../models/appConfig.js";

type ArticlePluginOptions = {
  articlePath?: string;
  mdPaths?: string;
};

export const articlePlugin = (options: ArticlePluginOptions = {}): Plugin => ({
  name: "core-article",
  setup: (cfg: AppConfig) => {
    const articlePath = options.articlePath || "pages/**/custom/articles.ejs";
    const mdPaths = options.mdPaths || "posts/*.md";

    return {
      beforeBuild: [
        {
          glob: [articlePath],
          fn: (files, cfg) => buildArticle(files, cfg, { articlePath, mdPaths }),
        },
      ],
      afterBuild: [],
    };
  },
});
