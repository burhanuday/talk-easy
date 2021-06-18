import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { agoraPublicKeys } from "constants/agora";
import { Container, Flex } from "@chakra-ui/react";

import AgoraRTC from "agora-rtc-sdk";

const Meeting = () => {
  const router = useRouter();
  const { meetingId } = router.query;

  const [joined, setJoined] = useState(false);

  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);

  const rtcRef = useRef({
    client: null,
    joined: false,
    published: false,
    localStream: null,
    remoteStreams: [],
    params: {},
  });

  const handleFail = () => {};

  /**
   * Handle user pressing the leave button or
   * the other user pressed the leave button
   */
  const handleLeave = () => {
    const rtc = rtcRef.current;

    // cleanup WebRTC streams
    if (rtc && rtc.client) {
      rtc.client.unpublish(rtc.localStream);
      // stop playing local stream
      rtc.localStream.stop();

      // close local stream
      if (rtc.localStream) {
        rtc.localStream.close();
      }
      rtc.client.leave(() => {
        // while (rtc.remoteStreams.length > 0) {
        //   const stream = rtc.remoteStreams.shift();
        //   stream.stop();
        // }
        // console.log("client leaves channel success");

        setJoined(false);
        rtcRef.current = null;

        // send to dashboard
      }, handleFail);
    }
  };

  /**
   * Attemp to join Agora call
   */
  const handleSubmit = useCallback(async () => {
    const rtc = rtcRef.current;

    if (!rtc || !meetingId) {
      return;
    }

    // generate uuid using math random
    // Agora only supports numbers as uid
    // generate a int id and convert to number
    let uid = Math.floor(Math.random() * 100 + 1);

    const channelName = meetingId; // use meeting id as channel id

    // generate a token before initialising client
    const response = await fetch("/api/generate-token", {
      body: JSON.stringify({
        uid,
        channelName,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    }).then((response) => response.json());

    const token = response.token;
    console.log(response.token, agoraPublicKeys);

    rtc.client = AgoraRTC.createClient({ mode: "rtc", codec: "h264" });
    rtc.client.init(
      agoraPublicKeys.appId,
      () => {
        // client init

        rtc.client.join(
          token, // token generated
          channelName, // name of channel to join
          uid,
          (uid) => {
            // client join success
            rtc.params.uid = uid;

            // create a stream
            rtc.localStream = AgoraRTC.createStream({
              streamID: rtc.params.uid,
              audio: false,
              video: true,
              screen: false,
            });
            rtc.localStream.setVideoProfile("480p_4");

            // initialise the local stream
            rtc.localStream.init(async () => {
              // local stream initialised
              rtc.localStream.play("local-stream", { fit: "contain" });

              // publish the local stream
              rtc.client.publish(rtc.localStream, handleFail);

              // setJoined
              setJoined(true);
            }, handleFail);
          },
          handleFail,
        );

        // subscribe to remote stream when it is added
        rtc.client.on("stream-added", async (evt) => {
          const remoteStream = evt.stream;
          const id = remoteStream.getId();
          if (id !== rtc.params.uid) {
            const repeated = rtc.remoteStreams.some((item) => item.getId() === id);
            if (repeated) {
              return;
            }
            rtc.remoteStreams.push(remoteStream);

            rtc.client.subscribe(remoteStream, handleFail);
          }
        });

        // play remote stream after subscribing to it
        rtc.client.on("stream-subscribed", (evt) => {
          const remoteStream = evt.stream;
          // const id = remoteStream.getId();

          remoteStream.play("remote-stream", { fit: "contain" });
        });

        // handle remote leave
        rtc.client.on("stream-removed", async (evt) => {
          const remoteStream = evt.stream;
          // const id = remoteStream.getId();
          remoteStream.close();
          // remoteStream.stop("remote-stream");
        });

        // called when remote calls leave or drops connection
        rtc.client.on("peer-leave", async (evt) => {
          const remoteStream = evt.stream;
          // let id = null;
          if (remoteStream) {
            // id = remoteStream.getId();
          }

          // peer has left the meeting
          // remove from remote streams
          // stop meeting timer
          rtc.remoteStreams.shift();

          if (remoteStream) {
            // remoteStream.stop("remote-stream");
            remoteStream.close();
          }
        });
      },
      handleFail,
    );
  }, [rtcRef, meetingId]);

  // Fetch expert data
  // Call handleLeave when this component is unmounted
  // Clean artifacts from Agora video call and exit gracefully
  useEffect(() => {
    handleSubmit();
  }, [handleSubmit]);

  if (typeof window === "undefined") {
    return "";
  }

  return (
    <Container>
      {rtcRef.current && (
        <Flex>
          <div
            ref={localStreamRef}
            id="local-stream"
            style={{ display: joined ? "block" : "none", height: "200px", width: "200px" }}
          />

          <div
            ref={remoteStreamRef}
            id="remote-stream"
            style={{ display: joined ? "block" : "none", height: "200px", width: "200px" }}
          />
        </Flex>
      )}
    </Container>
  );
};

export default Meeting;
