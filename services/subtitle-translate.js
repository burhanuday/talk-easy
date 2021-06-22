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

/**
 * Fetch subtitle for a intermediary text
 * @param {string} text text to fetch subtitle for
 * @param {string} from initial language
 * @param {string} to target language
 * @returns translated subtitle
 */
export const fetchSubtitle = async (text, from, to) => {
  try {
    let result = await fetch("/api/only-translate", {
      body: JSON.stringify({
        text,
        from,
        to,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    }).then((response) => response.json());

    result = await result.json();

    return result;
  } catch (error) {
    console.error(error);
    return "Error while fetching subtitles";
  }
};
