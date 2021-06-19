import React, { useState, useEffect } from "react";
import { init as initRecording, startRecording, stopRecording } from "utils/record";
import { Button, Flex, Text } from "@chakra-ui/react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { getMeetingDetails, getUserId, getUserLanguage } from "utils/storage";

export default function RecordBtns() {
  const [recording, setRecording] = useState(false);
  const [intermediateText, setIntermediateText] = useState("");

  useEffect(() => {
    const onResult = async (event) => {
      // console.log(event.results);
      try {
        if (event.results[0].isFinal) {
          const rawText = event.results[0][0].transcript;
          setIntermediateText(rawText);

          setTimeout(() => setIntermediateText(""), 2000);

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
        } else {
          let interim_transcript = "";
          for (let i = event.resultIndex; i < event.results.length; ++i)
            interim_transcript += event.results[i][0].transcript;

          setIntermediateText(interim_transcript);
        }
      } catch (e) {
        console.error(e);
      }
    };
    initRecording(onResult);
    return () => {};
  }, []);

  const handleRecordClick = () => {
    if (!recording) startRecording();
    else stopRecording();

    setRecording((r) => !r);
  };

  return (
    <Flex px={2} py={2} borderRadius="md" bg="gray.100" ml={2}>
      <Text flex={1}>{intermediateText}</Text>
      <Button onClick={handleRecordClick} colorScheme="green">
        {!recording ? <FaMicrophone /> : <FaMicrophoneSlash />}
      </Button>
    </Flex>
  );
}
