import React, { useState } from "react";
import { startRecording, stopRecording } from "utils/record";
import { Button } from "@chakra-ui/react";

export default function RecordBtns() {
  const [recording, setRecording] = useState(false);

  const handleRecordClick = () => {
    if (!recording) startRecording();
    else stopRecording();

    setRecording((r) => !r);
  };

  return <Button onClick={handleRecordClick}> {!recording ? "Record" : "Stop Recording"} </Button>;
}
