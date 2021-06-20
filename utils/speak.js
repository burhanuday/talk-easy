import { getUserLanguage } from "./storage";

let speechSynthesis;
let voices;

export const init = () => {
  if (!("speechSynthesis" in window)) {
    console.error("Speech Synthesis Not Available");
    return;
  }

  speechSynthesis = window.speechSynthesis;
  setTimeout(() => {
    voices = speechSynthesis.getVoices();
    console.log("VOICES after Timeout", voices);
  }, 3000);
};

export const speak = (text) => {
  const lang = getUserLanguage();
  const msg = new SpeechSynthesisUtterance();

  if (voices) {
    msg.text = text;

    let voice = voices.filter((voice) => voice.lang === lang);
    if (!voice?.length) voice = voices.filter((voice) => voice.lang === "hi-IN");

    msg.voice = voice[0];
    speechSynthesis.speak(msg);
  } else {
    console.error("VOICES NAHI HAI");
  }
};
