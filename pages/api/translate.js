import { db, firestore } from "utils/firebase-admin";
import { googleTranslate } from "utils/translate";

export default async function handler(req, res) {
  console.log(req.body);
  if (req.method === "POST") {
    const { languages, meetingId, rawText, userLanguage, userId } = req.body;

    const docKeLie = {
      userId,
      userLanguage,
      createdAt: firestore.FieldValue.serverTimestamp(),
      texts: [],
    };

    for (const destLang of languages) {
      if (destLang !== userLanguage) {
        const destText = await googleTranslate(rawText, userLanguage, destLang);
        docKeLie.texts.push({ lang: destLang, text: destText });
      }
    }
    docKeLie.texts.push({ lang: userLanguage, text: rawText });
    await db.collection("meetings").doc(meetingId).collection("messages").add(docKeLie);

    res.status(200).json({ ok: true });
  } else {
    res.status(405).json({
      error: "Method not allowed",
    });
  }
}
