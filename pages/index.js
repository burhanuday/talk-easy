import { useEffect, useState } from "react";
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
  Select,
  Box,
} from "@chakra-ui/react";
import NewMeetingModal from "components/NewMeetingModal";
import { appConfig } from "constants/app";
import { langaugeOptions } from "constants/supportedLanguages";
import { getUserId, getUserLanguage, setUserLanguage } from "utils/storage";

export default function Home() {
  const [link, setLink] = useState("");
  const [newMeetingId, setNewMeetingId] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const router = useRouter();

  const handleLinkChange = (e) => {
    setLink(e.target.value);
  };

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setSelectedLanguage(lang);
    setUserLanguage(lang);
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

  const fetchHistory = async () => {
    const userId = getUserId();

    if (userId) {
      setLoadingHistory(true);
      const db = firebase.firestore();

      const querySnapshot = await db
        .collection("meetings")
        .where("participants", "array-contains", userId)
        .get();

      const newHistory = [];

      querySnapshot.docs.forEach((doc) => {
        newHistory.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setHistory(newHistory);
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    setSelectedLanguage(getUserLanguage() || "en-IN");

    const f = async () => {
      await fetchHistory();
    };

    f();
  }, []);

  return (
    <div>
      <Head>
        <title>TalkEasy</title>
        <meta name="description" content="Talk easy" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container minH="100vh" maxW="container.lg">
        <Flex minH="100vh" justifyContent="center" flexDir="column">
          <Heading as="h1" size="4xl">
            TalkEasy
          </Heading>
          <Text mt={2} color="gray.500">
            Talk easily even when you speak in different languages
          </Text>

          <HStack mt={4} spacing={2}>
            <Box>
              <Heading as="h3" size="sm">
                Select langauge
              </Heading>
              <Select
                mt={1}
                w="200px"
                placeholder="Select langauge"
                onChange={handleLanguageChange}
                value={selectedLanguage}
              >
                {langaugeOptions.map((lang) => {
                  return (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  );
                })}
              </Select>
            </Box>
          </HStack>

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

        <Box>
          <Heading as="h3" size="md">
            History
          </Heading>
          {history.map((item) => {
            return (
              <Box key={item.key}>
                {item.createdAt.toDate().toLocaleTimeString()}{" "}
                {item.createdAt.toDate().toLocaleDateString()}
              </Box>
            );
          })}
        </Box>

        <NewMeetingModal isOpen={isOpen} onClose={onClose} meetingId={newMeetingId} />
      </Container>
    </div>
  );
}
