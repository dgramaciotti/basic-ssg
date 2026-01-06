import {
  ejsPlugin,
  tailwindPlugin,
  sitemapPlugin,
  blogPlugin,
  articlePlugin,
} from "basic-ssg";
import { assetsPlugin } from "@basic-ssg/plugin-assets";
import { googleDocsPlugin } from "@basic-ssg/plugin-google-docs";
const paths = {
  templatePath: "pages/**/custom/blog.ejs",
  articlePath: "pages/**/custom/articles.ejs",
};

// const myCustomPlugin = () => ({
//   name: "my-custom-plugin",
//   setup: (cfg) => ({
//     beforeBuild: [
//       {
//         glob: [cfg.paths.base, "!**/components/**", "!**/custom/**"],
//         fn: (files, cfg) => console.log("hello world: ", files, cfg),
//       },
//     ],
//     afterBuild: [],
//   }),
// });

export default {
  root: "pages",
  outDir: "dist-site",
  plugins: [
    // myCustomPlugin(),
    ejsPlugin(),
    tailwindPlugin(),
    assetsPlugin(),
    sitemapPlugin(),
    articlePlugin({ articlePath: paths.articlePath }),
    blogPlugin({ templatePath: paths.templatePath }),
    // google docs plugin alter posts files, so on watch mode will cause infinite loops
    // Skip Google Docs sync in watch mode to prevent infinite loops
    // googleDocsPlugin({
    //     pageName: "example-page",
    //     skip: process.env.SSG_WATCH_MODE === "true"
    // }),
  ],

  siteUrls: {
    // dir name is the site base
    "example-page": "https://mydomain.com",
  },
};
