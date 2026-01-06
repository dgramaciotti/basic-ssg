import fs from "fs";
import path from "path";
import { drive_v3 } from "googleapis";

export async function downloadGoogleDocs(
  drive: drive_v3.Drive,
  folderId: string
): Promise<string[]> {
  const root = process.cwd();
  const tempDir = path.join(root, "temp");
  fs.mkdirSync(tempDir, { recursive: true });

  const downloadedFiles: string[] = [];
  let pageToken: string | undefined = undefined;

  do {
    const res: any = await drive.files.list({
      q: `'${folderId}' in parents and mimeType='application/vnd.google-apps.document' and trashed=false`,
      fields: "nextPageToken, files(id, name)",
      pageToken,
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
      corpora: "allDrives",
    });

    const files = res.data.files || [];

    for (const file of files) {
      const destPath = path.join(tempDir, `${file.name}.docx`);

      const response = await drive.files.export(
        {
          fileId: file.id!,
          mimeType:
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        },
        { responseType: "stream" }
      );

      await new Promise<void>((resolve, reject) => {
        const stream = response.data as NodeJS.ReadableStream;
        const write = fs.createWriteStream(destPath);
        stream.pipe(write);
        write.on("finish", resolve);
        write.on("error", reject);
      });

      downloadedFiles.push(destPath);
    }

    pageToken = res.data.nextPageToken || undefined;
  } while (pageToken);

  return downloadedFiles;
}
