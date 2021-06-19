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
    console.log("timeout", voices);
  }, 2000);
};

export const speak = (text) => {
  const lang = getUserLanguage();
  const msg = new SpeechSynthesisUtterance();

  if (voices) {
    msg.text = text;
    msg.voice = voices.filter((voice) => voice.lang === lang)[0];
    speechSynthesis.speak(msg);
  } else {
    console.error("VOICES NAHI HAI");
  }
};
