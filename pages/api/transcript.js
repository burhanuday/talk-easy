import { db, storage } from "utils/firebase-admin";

const path = require("path");
const os = require("os");
const fs = require("fs");

const tmpdir = os.tmpdir();
const bucket = storage.bucket();

export default async function handler(req, res) {
  const { userLanguage, meetingId, userId } = req.body;
  const lang = userLanguage.split("-")[0];
  const data = [];

  try {
    const { docs } = await db.collection("meetings").doc(meetingId).collection("messages").get();
    for (const doc of docs) {
      const { texts, createdAt, userId: messageUserId } = doc.data();
      const { text } = texts.filter((item) => item.lang === lang)[0];
      const date = createdAt.toDate().toLocaleString();
      data.push(`[${date}] ${messageUserId === userId ? "You" : "Peer"} : ${text}`);
    }

    const filename = `${meetingId}-${userId}.txt`;
    const filepath = path.join(tmpdir, filename);
    const destFilePath = `talkeasy/${filename}`;

    fs.writeFileSync(filepath, data.join("\n"), {
      encoding: "utf-8",
    });
    await bucket.upload(filepath, { destination: destFilePath });
    const file = bucket.file(destFilePath);
    const [url] = await file.getSignedUrl({ action: "read", expires: "01-01-2500" });

    return res.status(200).json({ url });
  } catch (e) {
    console.error(e);
  }

  return res.status(200).json({ error: true });
}
