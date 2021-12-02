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
    const animatedProps = isOpen
        ? {
              top: "10rem",
              opacity: 1,
          }
        : {
              top: "8rem",
              opacity: 0,
          };
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
            transition="opacity 0.15s, top 0.25s"
            pos="fixed"
            transform="translateX(-50%)"
            left="50%"
            bgColor="primary.darkest"
            zIndex={100000}
            rounded="base"
            pointerEvents={!isOpen ? "none" : undefined}
            boxShadow="0 0 30px 0 rgba(0, 0, 0, 0.5)"
            opacity={isOpen ? 1 : 0}
            {...(animatedProps as any)}
            {...(props as any)}
        >
            {children}
        </Flex>
    );
}

Modal.Body = ModalBody;
Modal.Overlay = ModalOverlay;
Modal.Content = ModalContent;
Modal.Header = ModalHeader;
