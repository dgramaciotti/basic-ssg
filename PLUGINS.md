# Plugin System Documentation

BasicSSG is built on a "Microkernel" architecture. The core is responsible for configuration loading and the build loop, while almost every feature—from EJS rendering to Tailwind CSS—is implemented as a plugin.

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Environment Variables](#environment-variables)
3. [Plugin Interface](#plugin-interface)
4. [The Hooks System](#the-hooks-system)
5. [Creating Your First Plugin](#creating-your-first-plugin)
6. [Core Plugin Reference](#core-plugin-reference)
    - [EJS Plugin](#ejs-plugin)
    - [Tailwind Plugin](#tailwind-plugin)
    - [Sitemap Plugin](#sitemap-plugin)
    - [Blog Plugin](#blog-plugin)
    - [Article Plugin](#article-plugin)
    - [Assets Plugin](#assets-plugin)
    - [Google Docs Sync Plugin](#google-docs-sync-plugin)

---

## Architecture Overview

The build process is driven by **Hooks**. Plugins register functions to these hooks during the `setup` phase. When the build runs, the core iterates through these hooks, executing the registered functions.

## Environment Variables

BasicSSG and its plugins use environment variables for configuration and sensitive data. You can define these in a `.env` file at the root of your project.

| Variable | Description | Used By |
| :--- | :--- | :--- |
| `GOOGLE_CLIENT_EMAIL` | Service Account email for Google APIs. | `googleDocsPlugin` |
| `GOOGLE_PRIVATE_KEY` | Private key for the Service Account. | `googleDocsPlugin` |
| `BLOG_FOLDER_ID` | The ID of the Google Drive folder to sync. | `googleDocsPlugin` |
| `SSG_WATCH_MODE` | Set to `true` when running in watch/dev mode. | Core / All Plugins |

---

## Plugin Interface

A plugin is a simple object with a `name` and a `setup` function.

```typescript
type Plugin = {
    name: string;
    setup: (config: AppConfig) => Hooks;
}
```

- **`name`**: A unique identifier for the plugin (e.g., `core-ejs`).
- **`setup(config)`**: Called once when the configuration is resolved. It receives the `AppConfig` and must return a `Hooks` object.

## The Hooks System

There are two primary hooks in the build cycle:

### `beforeBuild`
Used for generating or transforming files before the final output.
- **`glob`**: An array of file patterns to watch or process.
- **`fn(files, config)`**: The function executed during the build.

### `afterBuild`
Used for post-processing tasks like generating sitemaps or cleanup.
- **`glob`**: Patterns for files affected by the build.
- **`fn(files, config)`**: Executed after all `beforeBuild` hooks have finished.

---

## Creating Your First Plugin

Here is a simple plugin that creates a `robots.txt` file in your output directory.

```javascript
const robotsPlugin = () => ({
  name: "my-robots-plugin",
  setup: (config) => ({
    beforeBuild: [
      {
        glob: [], // No input files needed
        fn: async (files, cfg) => {
          const fs = await import("node:fs/promises");
          const path = await import("node:path");
          const content = "User-agent: *\nDisallow:";
          await fs.writeFile(path.join(cfg.paths.dist, "robots.txt"), content);
        },
      },
    ],
  }),
});
```

---

## Core Plugin Reference

### EJS Plugin
- **Usage**: `ejsPlugin()`
- **Input**: All `.ejs` files in your root (typically `pages/**/*.ejs`), excluding those in `components` or `custom`.
- **Output**: Compiled `.html` files in `dist-site`.
- **Pattern**: Standardizes layout by allowing shared components.

### Tailwind Plugin
- **Usage**: `tailwindPlugin()`
- **Input**: `index.css` files.
- **Output**: Processed `output.css` files with Tailwind CSS 4.0.
- **Pattern**: Automatically scans your EJS files for classes and generates an optimized stylesheet.

### Sitemap Plugin
- **Usage**: `sitemapPlugin()`
- **Input**: The generated `dist-site` directory.
- **Output**: `sitemap.xml` at the root of your output directory.
- **Pattern**: An `afterBuild` plugin that uses `siteUrls` from your config to map generated HTML files to absolute URLs.

### Blog Plugin
- **Usage**: `blogPlugin({ templatePath: "...", mdPaths: "..." })`
- **Input**: Markdown files (`.md`).
- **Output**: Individual blog posts rendered using a specified EJS template.
- **Pattern**: Splits content into metadata (gray-matter) and HTML (markdown-it).

### Article Plugin
- **Usage**: `articlePlugin({ articlePath: "...", mdPaths: "..." })`
- **Input**: Markdown files.
- **Output**: An index page (e.g., `articles.html`) listing all posts with their metadata.
- **Pattern**: Collects metadata from all posts into an `articles` array passed to the template.

### Assets Plugin
- **Usage**: `assetsPlugin()`
- **Input**: Any file inside `**/assets/**` folders.
- **Output**: Copied directly to the same relative path in `dist-site`. Transforms raster images (png, jpeg, jpg, etc) to webp with sharp, also transforming size to fixed value.
- **Pattern**: Simple passthrough for images, fonts, and other static media.

### Google Docs Sync Plugin
Synchronizes a Google Drive folder containing Google Docs with your local `posts` directory, converting them to Markdown.

#### Usage
```javascript
googleDocsPlugin({
    pageName: "my-page",
    skip: process.env.SSG_WATCH_MODE === "true" // if not skipped will cause an infinite loop
})
```

#### Setup Requirements
To use this plugin, you must set up a Google Cloud Service Account that has permission to read your Drive folder.

1.  **Google Cloud Console**:
    - Create a project in the [Google Cloud Console](https://console.cloud.google.com/).
    - Enable the **Google Drive API** and **Google Docs API**.
2.  **Service Account**:
    - Go to **IAM & Admin > Service Accounts**.
    - Create a Service Account and note its **Email Address** (e.g., `ssg-sync@project-id.iam.gserviceaccount.com`).
    - Go to **Keys**, click **Add Key > Create New Key**, and select **JSON**.
3.  **Environment Configuration**:
    - Open the downloaded JSON key.
    - Set `GOOGLE_CLIENT_EMAIL` to the `client_email` value.
    - Set `GOOGLE_PRIVATE_KEY` to the `private_key` value (ensure newlines are preserved or escaped).
    - Set `BLOG_FOLDER_ID` to the ID of the folder you want to sync (found in the folder's URL).
4.  **Authorization**:
    - Go to your Google Drive folder.
    - Click **Share**.
    - Add the **Service Account Email** and grant it **Viewer** access. This is crucial as the service account relies on this authorization to list and read files in the folder.
