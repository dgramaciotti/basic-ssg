import mammoth from "mammoth";
import fs from "fs";
import path from "path";

export async function docToHtml(
  docpath: string,
  htmlpath: string,
  dist: string
) {
  fs.mkdirSync(dist, { recursive: true });

  let index = 1;

  const result = await mammoth.convertToHtml({ path: docpath }, {
    convertImage: mammoth.images.imgElement(async (image: any) => {
      const ext = image.contentType.split("/")[1];
      const name = `image-${index++}.${ext}`;
      const filePath = path.join(dist, name);

      const buffer = await image.readAsBuffer();
      fs.writeFileSync(filePath, buffer);

      return {
        src: `${path.basename(dist)}/${name}`,
      };
    }),
  } as any);

  fs.writeFileSync(htmlpath, result.value);
}
