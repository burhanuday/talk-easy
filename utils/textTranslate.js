import translate from "google-translate-api";

export const translatedText = translate("Ik spreek Engels", { to: "en" })
  .then((res) => {
    console.log(res.text);
    //=> I speak English
    console.log(res.from.language.iso);
    //=> nl
  })
  .catch((err) => {
    console.error(err);
  });
