import { Box, Text } from "@chakra-ui/layout";
import { useEffect, useRef, useState } from "react";
import { getUserId, getUserLanguage } from "services/storage";

const TranscriptBox = ({ messages }) => {
  const [transcript, setTranscript] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    const userLanguage = getUserLanguage().split("-")[0];
    const userId = getUserId();

    const trans = [];
    messages.forEach((message) => {
      const text = message.texts.find((t) => t.lang === userLanguage);
      if (text) {
        trans.push({
          id: message.id,
          content: text.text,
          userName: userId === message.userId ? "You" : "Peer",
        });
      }
    });

    setTranscript(trans);
    scrollRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [messages]);

  return (
    <Box>
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
      <div ref={scrollRef} />
    </Box>
  );
};

export default TranscriptBox;
