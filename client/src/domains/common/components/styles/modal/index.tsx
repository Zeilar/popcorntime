import { ModalProps, Modal as ChakraModal } from "@chakra-ui/modal";
import ModalBody from "./Body";
import ModalHeader from "./Header";
import ModalContent from "./Content";
import ModalOverlay from "./Overlay";

function Modal(props: ModalProps) {
    return <ChakraModal {...props}>{props.children}</ChakraModal>;
}

Modal.Body = ModalBody;
Modal.Overlay = ModalOverlay;
Modal.Content = ModalContent;
Modal.Header = ModalHeader;

export default Modal;
