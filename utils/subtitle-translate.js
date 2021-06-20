// import translate from "translation-google";
const { Translate } = require("@google-cloud/translate").v2;

// Creates a client
const translate = new Translate({
  projectId: "talk-easy-d2267",
  keyFilename: "../service-account-key.json",
});

/**
 * Translate a sentence from initial language to target language
 * @param {string} text text to be translated
 * @param {string} from 2 char character code of initial language
 * @param {string} to 2 char code of target language
 * @returns translated text
 */
export const subtitleGoogleTranslate = async (text, from, to) => {
  try {
    let [translations] = await translate.translate(text, to);
    translations = Array.isArray(translations) ? translations : [translations];
    console.log("Translations:");
    const data = translations[0];
    if (data) {
      return data;
    } else {
      return "";
    }
  } catch (error) {
    console.log(error.message);
    return "";
  }
};
