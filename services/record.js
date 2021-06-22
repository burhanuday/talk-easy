import { getUserLanguage } from "services/storage";

let recognition;

export const startRecording = () => {
  if (recognition) recognition.start();
  else {
    console.error("no audio api");
    return;
  }
};

export const stopRecording = () => {
  if (recognition) recognition.stop();
  else {
    console.error("no audio api");
    return;
  }
};

export const init = (onResult) => {
  if (!("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
    console.error("Speech Recognition Not Available");
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  //   console.log(SpeechRecognition);
  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = getUserLanguage();

  //   recognition.onstart = () => {
  //     console.log("started");
  //   };

  //   recognition.onend = (e) => {
  //     console.log("ended", e);
  //   };

  recognition.onresult = onResult;
};
