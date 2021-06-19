import { Box, Text } from "@chakra-ui/layout";
import { useEffect, useState } from "react";
import { getUserId, getUserLanguage } from "utils/storage";

const TranscriptBox = ({ messages }) => {
  const [transcript, setTranscript] = useState([]);

  useEffect(() => {
    const userLanguage = getUserLanguage().split("-")[0];
    const userId = getUserId();
    const trans = [];
    messages.forEach((message) => {
      const text = message.texts.find((t) => t.lang === userLanguage);
      console.log("text", text);
      if (text) {
        trans.push({
          id: message.id,
          content: text.text,
          userName: userId === message.userId ? "You" : "Peer",
        });
      }
    });

    console.log(trans);
    setTranscript(trans);
  }, [messages]);

  return (
    <Box maxH="50vh" overflowY="auto">
      {transcript.map((message) => {
        return (
          <Box key={message.id}>
            <Text fontWeight="bold" display="inline">
              {message.userName}:{" "}
            </Text>
            {message.content}
          </Box>
        );
      })}
    </Box>
  );
};

export default TranscriptBox;
