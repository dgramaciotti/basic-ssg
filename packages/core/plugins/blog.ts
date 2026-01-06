import { buildBlog as buildBlogHook } from "./buildBlog.js";
import { Plugin } from "../models/plugin.js";
import { AppConfig } from "../models/appConfig.js";

type BlogPluginOptions = {
  templatePath?: string;
  mdPaths?: string;
};

export const blogPlugin = (options: BlogPluginOptions = {}): Plugin => ({
  name: "core-blog",
  setup: (cfg: AppConfig) => {
    // Default paths convention
    const templatePath = options.templatePath || "pages/**/custom/blog.ejs";
    const mdPaths = options.mdPaths || "posts/*.md";

    return {
      beforeBuild: [
        {
          glob: [templatePath],
          fn: function buildBlog(files, cfg) {
            return buildBlogHook(files, cfg, { templatePath, mdPaths });
          },
        },
      ],
      afterBuild: [],
    };
  },
});
