import { ejsPlugin, tailwindPlugin, sitemapPlugin } from "basic-ssg";

export default {
  root: "pages",
  outDir: "dist-site",
  plugins: [
    ejsPlugin(),
    tailwindPlugin(),
    sitemapPlugin(),
  ],
  siteUrls: {
    "example-page": "https://mydomain.com",
  },
};
