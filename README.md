# Basic-SSG

A Node.js Static Site Generator (SSG). Minimalist, no-framework, and highly configurable.

It uses `ejs` for templating and gives you full control over the build process via plugins.

## Getting Started

1.  **Initialize a new project**:

    ```bash
    mkdir my-site && cd my-site
    npm install basic-ssg
    npx basic-ssg init
    ```

    This creates an example site in `./pages` and a `pages.config.js` file.

2.  **Build**:

    ```bash
    npx basic-ssg build
    ```

    The site is output to `dist-site/` by default.

3.  **Watch Mode**:
    ```bash
    npx basic-ssg build --watch
    ```

## Project Structure

- `pages/`: Your site's source.
  - `*.ejs`: Pages (e.g., `index.ejs`, `about.ejs`).
  - `components/`: Reusable partials (buttons, headers).
  - `custom/`: Logic templates (see below).
  - `assets/`: Images and static files.
- `pages.config.js`: Configuration and plugins.

## Configuration

The configuration file allows you to define site metadata and register plugins.

**pages.config.js**:

```javascript
import {
  ejsPlugin,
  tailwindPlugin,
  sitemapPlugin,
  blogPlugin,
} from "basic-ssg";

export default {
  root: "pages",
  outDir: "dist-site",
  siteUrls: {
    "my-page": "https://mysite.com",
  },
  plugins: [
    ejsPlugin(),
    tailwindPlugin(),
    sitemapPlugin(),
    blogPlugin({ templatePath: "pages/**/custom/blog.ejs" }),
  ],
};
```

### Standard Plugins

- `ejsPlugin`: Renders standard `.ejs` pages.
- `tailwindPlugin`: Compiles Tailwind CSS.
- `sitemapPlugin`: Generates `sitemap.xml`.
- `blogPlugin`: Generates blog posts from markdown files.

## Plugins

BasicSSG is powered by a flexible plugin system. For detailed information on how to use the built-in plugins or create your own, see the [Plugin Documentation](./PLUGINS.md).

## Deployment

### NGINX

```nginx
location / {
    root /usr/share/nginx/html;
    index index.html;
    try_files $uri $uri/ $uri.html =404;
}
```

## Deployment

### NGINX

```nginx
location / {
    root /usr/share/nginx/html;
    index index.html;
    try_files $uri $uri/ $uri.html =404;
}
```
