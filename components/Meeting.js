import React, { useState, useRef, useEffect, useCallback } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import { useRouter } from "next/router";
import { agoraPublicKeys } from "constants/agora";
import { Flex, Grid, Box, Button } from "@chakra-ui/react";

import AgoraRTC from "agora-rtc-sdk";
import { getUserId, getUserLanguage, setMeetingDetails } from "utils/storage";
import { startRecording, stopRecording, init } from "utils/audio";
import TranscriptBox from "./TranscriptBox";

const Meeting = () => {
  const router = useRouter();
  const { meetingId } = router.query;

  const [joined, setJoined] = useState(false);
  const [messages, setMessages] = useState([]);

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

  useEffect(() => {
    init();
    const db = firebase.firestore();

    const unsubs = db
      .collection("meetings")
      .doc(meetingId)
      .onSnapshot((snapshot) => {
        setMeetingDetails({ id: meetingId, ...snapshot.data() });
      });

    const unsubscribe = db
      .collection("meetings")
      .doc(meetingId)
      .collection("messages")
      .orderBy("createdAt", "asc")
      .onSnapshot((docs) => {
        const newMessages = [];
        docs.forEach((doc) => {
          newMessages.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        setMessages(newMessages);
      });

    return () => {
      unsubs();
      unsubscribe();
    };
  }, [meetingId]);

  const addParticipantToMeeting = useCallback(async () => {
    const userId = getUserId();
    const lang = getUserLanguage().split("-")[0];

    const db = firebase.firestore();

    await db
      .collection("meetings")
      .doc(meetingId)
      .update({
        participants: firebase.firestore.FieldValue.arrayUnion(userId),
        languages: firebase.firestore.FieldValue.arrayUnion(lang),
      });
  }, [meetingId]);

  /**
   * Attemp to join Agora call
   */
  const joinAgoraCall = useCallback(async () => {
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
    // console.log(response.token, agoraPublicKeys);

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

  // Call handleLeave when this component is unmounted
  // Clean artifacts from Agora video call and exit gracefully
  useEffect(() => {
    const f = async () => {
      await Promise.all([joinAgoraCall(), addParticipantToMeeting()]);
    };

    f();
  }, [joinAgoraCall, addParticipantToMeeting]);

  if (typeof window === "undefined") {
    return "";
  }

  return (
    <Box p={8} w="100vw">
      <Grid w="100%" templateColumns="2fr 1fr">
        {/* Video call */}
        <Box w="100%" bg="black">
          {rtcRef.current && (
            <Flex w="100%">
              <div
                ref={localStreamRef}
                id="local-stream"
                style={{ display: "none" }}
                // style={{ display: joined ? "block" : "none", height: "200px", width: "200px" }}
              />

              <div
                ref={remoteStreamRef}
                id="remote-stream"
                style={{ display: joined ? "block" : "none", height: "350px", width: "100%" }}
              />
            </Flex>
          )}
        </Box>

        {/* Audio recording */}
        <Box w="100%">
          <Button onClick={startRecording}> Record </Button>
          <Button onClick={() => stopRecording()}> Stop Record </Button>
        </Box>
      </Grid>

      {/* Transcription */}
      <Box w="100%" bg="gray.200">
        <TranscriptBox messages={messages} />
      </Box>
    </Box>
  );
};

export default Meeting;
