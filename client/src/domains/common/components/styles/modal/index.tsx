import ModalBody from "./Body";
import ModalHeader from "./Header";
import ModalContent from "./Content";
import ModalOverlay from "./Overlay";
import { Flex, FlexProps } from "@chakra-ui/layout";
import { useEffect } from "react";

interface IModalProps extends FlexProps {
    onClose(): void;
    isOpen?: boolean;
    blockScrollOnMount?: boolean;
}

export default function Modal({
    isOpen,
    blockScrollOnMount,
    children,
    ...props
}: IModalProps) {
    useEffect(() => {
        if (blockScrollOnMount) {
            document.body.style.overflowY = "hidden";
        }
        return () => {
            document.body.style.overflowY = "";
        };
    }, [blockScrollOnMount]);
    return (
        <Flex
            transition="0.1s ease-in-out"
            pos="fixed"
            transform="translateX(-50%)"
            left="50%"
            top="10rem"
            bgColor="gray.600"
            zIndex={100000}
            rounded="base"
            boxShadow="0 0 30px 0 rgba(0, 0, 0, 0.5)"
            opacity={isOpen ? 1 : 0}
            {...props}
        >
            {children}
        </Flex>
    );
}

Modal.Body = ModalBody;
Modal.Overlay = ModalOverlay;
Modal.Content = ModalContent;
Modal.Header = ModalHeader;
