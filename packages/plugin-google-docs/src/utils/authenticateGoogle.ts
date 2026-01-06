import { google } from "googleapis";

export async function authenticateGoogle() {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });

  await auth.authorize();

  return google.drive({ version: "v3", auth });
}
