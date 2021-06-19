import React, { useState } from "react";
import { startRecording, stopRecording } from "utils/record";
import { Button, Flex, Text } from "@chakra-ui/react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";

export default function RecordBtns() {
  const [recording, setRecording] = useState(false);

  const handleRecordClick = () => {
    if (!recording) startRecording();
    else stopRecording();

    setRecording((r) => !r);
  };

  return (
    <Flex justifyContent="flex-end" px={2} py={2} borderRadius="md" bg="gray.100" ml={2}>
      <Text></Text>
      <Button onClick={handleRecordClick} colorScheme="green">
        {!recording ? <FaMicrophone /> : <FaMicrophoneSlash />}
      </Button>
    </Flex>
  );
}
