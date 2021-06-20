import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/database";
import { init as initRecording, startRecording, stopRecording } from "utils/record";
import { Button, Flex } from "@chakra-ui/react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { BiExit } from "react-icons/bi";
import { getMeetingDetails, getUserId, getUserLanguage } from "utils/storage";
import { useRouter } from "next/router";

export default function RecordBtns({ meetingId, handleLeave }) {
  const router = useRouter();
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    const userId = getUserId();
    const onResult = async (event) => {
      // console.log(event.results);
      try {
        if (event.results[0].isFinal) {
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
        } else {
          let interim_transcript = "";
          for (let i = event.resultIndex; i < event.results.length; ++i)
            interim_transcript += event.results[i][0].transcript;

          const database = firebase.database();

          await database.ref("meetings/" + meetingId).set({
            text: interim_transcript,
            userId: userId,
          });
        }
      } catch (e) {
        console.error(e);
      }
    };
    initRecording(onResult);
    return () => {};
  }, [meetingId]);

  const handleRecordClick = () => {
    if (!recording) startRecording();
    else stopRecording();

    setRecording((r) => !r);
  };

  const handleLeaveStream = () => {
    handleLeave();
    router.replace("/");
  };

  return (
    <Flex justifyContent="space-between" px={2} py={2} borderRadius="md" bg="gray.100" ml={2}>
      <Button onClick={handleRecordClick} colorScheme="green">
        {!recording ? <FaMicrophone /> : <FaMicrophoneSlash />}
      </Button>
      <Button onClick={handleLeaveStream} leftIcon={<BiExit />} colorScheme="red">
        Leave
      </Button>
    </Flex>
  );
}
