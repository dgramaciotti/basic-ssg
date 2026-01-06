import fg from "fast-glob";
import { readFile, stat } from "node:fs/promises";
import markdownit from "markdown-it";
import path from "node:path";
import { getFileUrl } from "./getFileUrl.js";
import { calculateReadingTime } from "./calculateReadingTime.js";
import matter from "gray-matter";

const md = markdownit({ html: true });

export type PageData = {
  post: string;
  postUrl: string;
  postName: string;
  postDate: string;
  postAuthor: string;
  postDescription: string;
  postTime: number;
  coverImage: string;
};

export async function getPageData(globPath: string) {
  const posts = await fg(globPath, { onlyFiles: true });

  return Promise.all(
    posts.map(async (post) => {
      const fileContents = await readFile(post, "utf-8");
      const stats = await stat(post);
      const { data, content } = matter(fileContents);
      const htmlContent = md.render(content);
      const fileName = path.basename(post, ".md");

      return {
        post: htmlContent,
        postUrl: getFileUrl(fileName),
        postName: data.title ?? fileName,
        postDate:
          data.date ?? new Date(stats.birthtimeMs).toLocaleDateString("pt-BR"),
        postAuthor: data.author ?? "Anonymous",
        postDescription: data.description ?? "",
        postTime: calculateReadingTime(content),
        coverImage: data.coverImage ?? fileName.replace(/\s+/g, ""),
      };
    }),
  );
}
