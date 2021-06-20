import { subtitleGoogleTranslate } from "utils/subtitle-translate";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { text, from, to } = req.body;

    const destText = await subtitleGoogleTranslate(text, from, to);

    res.status(200).json({ ok: true, text: destText });
  } else {
    res.status(405).json({
      error: "Method not allowed",
    });
  }
}
