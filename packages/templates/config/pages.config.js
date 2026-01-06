import { ejsPlugin, tailwindPlugin, sitemapPlugin } from "basic-ssg";
import { assetsPlugin } from "@basic-ssg/plugin-assets";

export default {
  root: "pages",
  outDir: "dist-site",
  plugins: [
    assetsPlugin(),
    ejsPlugin(),
    tailwindPlugin(),
    sitemapPlugin(),
  ],
  siteUrls: {
    "example-page": "https://mydomain.com",
  },
};
