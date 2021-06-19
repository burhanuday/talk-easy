import { getMeetingDetails, getUserId, getUserLanguage } from "utils/storage";

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

export const init = () => {
  if (!("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
    console.error("Speech Recognition Not Available");
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  //   console.log(SpeechRecognition);
  recognition = new SpeechRecognition();
  console.log("recognition", recognition);
  recognition.continuous = true;
  recognition.interimResults = false; // TODO: test with true as well
  recognition.lang = getUserLanguage();

  //   recognition.onstart = () => {
  //     console.log("started");
  //   };

  //   recognition.onend = (e) => {
  //     console.log("ended", e);
  //   };

  recognition.onresult = async (event) => {
    try {
      const rawText = event.results[0][0].transcript;
      const data = getMeetingDetails();

      await fetch("/api/translate", {
        method: "POST",
        body: JSON.stringify({
          rawText,
          meetingId: data.id,
          userId: getUserId(),
          languages: data.languages,
          userLanguage: getUserLanguage().split("-")[0],
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (e) {
      console.error(e);
    }
  };
};
