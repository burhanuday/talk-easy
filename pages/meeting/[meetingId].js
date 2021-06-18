import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const Meeting = dynamic(() => import("../../components/Meeting"), {
  ssr: false,
});

export default function MeetingPage() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  return <div>{show && typeof window !== "undefined" && <Meeting />}</div>;
}
