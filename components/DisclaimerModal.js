import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  Text,
} from "@chakra-ui/react";

const DisclaimerModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Disclaimer</ModalHeader>
        <ModalBody>
          <Text>This website is for demo purpose only.</Text>
          <Text>Some features like subtitles might not work to reduce our bills.</Text>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="red" mr={2} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DisclaimerModal;
