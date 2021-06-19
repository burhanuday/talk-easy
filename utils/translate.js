import translate from "translation-google";

/**
 * Translate a sentence from initial language to target language
 * @param {string} text text to be translated
 * @param {string} from 2 char character code of initial language
 * @param {string} to 2 char code of target language
 * @returns translated text
 */
export const googleTranslate = async (text, from, to) => {
  try {
    const res = await translate(text, { from, to });

    // console.log("text:", res.text);
    // //=> Ik spreek Nederlands!
    // console.log(res.from.text.autoCorrected);
    // //=> true
    // console.log(res.from.text.value);
    // //=> I [speak] Dutch!
    // console.log(res.from.text.didYouMean);
    // //=> false

    return res.text;
  } catch (error) {
    console.log("error while translating", error);
    return "";
  }
};
