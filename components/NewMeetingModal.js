import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Link,
  Text,
  useClipboard,
  Flex,
  Input,
} from "@chakra-ui/react";
import { appConfig } from "constants/app";

const NewMeetingModal = ({ isOpen, onClose, meetingId }) => {
  const meetingLink = `${appConfig.clientLocation}/meeting/${meetingId}`;

  const { hasCopied, onCopy } = useClipboard(meetingLink);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Join new meeting</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Share this link to join</Text>
          <Flex mt={2}>
            <Input value={meetingLink} isReadOnly placeholder="Meeting link" />
            <Button ml={2} onClick={onCopy}>
              {hasCopied ? "Copied" : "Copy"}
            </Button>
          </Flex>
        </ModalBody>

        <ModalFooter>
          <Link href={meetingLink}>
            <Button colorScheme="green" mr={3} onClick={onClose}>
              Join
            </Button>
          </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default NewMeetingModal;
