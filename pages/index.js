import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import firebase from "firebase/app";
import "firebase/firestore";
import {
  Container,
  Heading,
  Flex,
  Button,
  Input,
  HStack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import NewMeetingModal from "components/NewMeetingModal";
import { appConfig } from "constants/app";

export default function Home() {
  const [link, setLink] = useState("");
  const [newMeetingId, setNewMeetingId] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLinkChange = (e) => {
    setLink(e.target.value);
  };

  const handleDonePressed = () => {
    if (link.startsWith("http")) {
      router.push(link);
    } else {
      router.push(`${appConfig.clientLocation}/meeting/${link}`);
    }
  };

  const handleNewMeetingPressed = async () => {
    const db = firebase.firestore();

    setLoading(true);

    const docRef = db.collection("meetings").doc();
    await docRef.set({
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });

    setNewMeetingId(docRef.id);
    onOpen();
    setLoading(false);
  };

  return (
    <div>
      <Head>
        <title>TalkEasy</title>
        <meta name="description" content="Talk easy" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container h="100vh" maxW="container.lg">
        <Flex h="100vh" justifyContent="center" flexDir="column">
          <Heading as="h1" size="4xl">
            TalkEasy
          </Heading>
          <Text mt={2} color="gray.500">
            Talk easily even when you speak in different languages
          </Text>

          <HStack spacing={2} mt={10}>
            <Button isLoading={loading} onClick={handleNewMeetingPressed} colorScheme="green">
              New meeting
            </Button>
            <Input
              value={link}
              onChange={handleLinkChange}
              placeholder="Enter a code or link"
              maxW="xs"
            />
            <Button
              onClick={handleDonePressed}
              disabled={!link}
              variant="ghost"
              colorScheme="green"
            >
              Join
            </Button>
          </HStack>
        </Flex>

        <NewMeetingModal isOpen={isOpen} onClose={onClose} meetingId={newMeetingId} />
      </Container>
    </div>
  );
}
