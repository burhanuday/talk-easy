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
  IconButton,
  CircularProgress,
  Center,
} from "@chakra-ui/react";
import NewMeetingModal from "components/NewMeetingModal";
import { appConfig } from "constants/app";
import { langaugeOptions } from "constants/supportedLanguages";
import { getUserId, getUserLanguage, setUserLanguage } from "services/storage";
import { FaFileDownload } from "react-icons/fa";
import DisclaimerModal from "components/DisclaimerModal";

export default function Home() {
  const [link, setLink] = useState("");
  const [newMeetingId, setNewMeetingId] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [transcriptionLoading, setTranscriptionLoading] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDisclaimerOpen,
    onOpen: onDisclaimerOpen,
    onClose: onDisclaimerClose,
  } = useDisclosure();

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

  const handleTranscriptionDownload = async (meetingId) => {
    setTranscriptionLoading(meetingId);

    const userId = getUserId();
    const userLanguage = getUserLanguage();

    const response = await fetch("/api/transcript", {
      body: JSON.stringify({
        meetingId,
        userId,
        userLanguage,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    }).then((response) => response.json());

    console.log(response);

    const url = response.url;

    const a = document.createElement("a");
    a.setAttribute("download", "true");
    a.setAttribute("href", url);
    a.setAttribute("target", "_blank");

    a.click();

    setTranscriptionLoading(false);
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
        .orderBy("createdAt", "desc")
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
    onDisclaimerOpen();

    const f = async () => {
      await fetchHistory();
    };

    f();
  }, [onDisclaimerOpen]);

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

          <Heading mt={8} as="h3" size="md">
            History
          </Heading>

          <Center>
            {loadingHistory && <CircularProgress isIndeterminate color="green.500" />}
          </Center>

          <Box p={4} height="40vh" overflowY="auto">
            {history.map((item) => {
              return (
                <Flex
                  mb={2}
                  p={3}
                  boxShadow="md"
                  key={item.id}
                  border={"1px solid #eee"}
                  borderRadius="md"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Text>
                    Meeting at {item.createdAt.toDate().toLocaleTimeString()}{" "}
                    {item.createdAt.toDate().toLocaleDateString()}
                  </Text>
                  <IconButton
                    isLoading={transcriptionLoading === item.id}
                    onClick={() => handleTranscriptionDownload(item.id)}
                    colorScheme="green"
                    aria-label="Download"
                    icon={<FaFileDownload />}
                  />
                </Flex>
              );
            })}
          </Box>
        </Flex>

        <NewMeetingModal isOpen={isOpen} onClose={onClose} meetingId={newMeetingId} />
        <DisclaimerModal isOpen={isDisclaimerOpen} onClose={onDisclaimerClose} />
      </Container>
    </div>
  );
}
