import ModalBody from "./Body";
import ModalHeader from "./Header";
import ModalContent from "./Content";
import ModalOverlay from "./Overlay";
import { Flex, FlexProps } from "@chakra-ui/layout";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface IModalProps extends FlexProps {
    onClose(): void;
    isOpen?: boolean;
    blockScrollOnMount?: boolean;
}

const Motion = motion<FlexProps>(Flex);

export default function Modal({
    isOpen,
    blockScrollOnMount,
    children,
    ...props
}: IModalProps) {
    useEffect(() => {
        if (blockScrollOnMount) {
            document.body.style.overflowY = isOpen ? "hidden" : "";
        }
    }, [blockScrollOnMount, isOpen]);
    useEffect(() => {
        return () => {
            document.body.style.overflowY = "";
        };
    }, []);
    return (
        <AnimatePresence>
            {isOpen && (
                <Motion
                    exit={{ top: "8rem", opacity: 0 }}
                    animate={{ top: "10rem", opacity: 1 }}
                    top="8rem"
                    transition="opacity 0.15s, top 0.25s"
                    pos="fixed"
                    transform="translateX(-50%)"
                    left="50%"
                    bgColor="primary.darkest"
                    zIndex={100000}
                    rounded="base"
                    boxShadow="0 0 30px 0 rgba(0, 0, 0, 0.5)"
                    {...(props as any)}
                >
                    {children}
                </Motion>
            )}
        </AnimatePresence>
    );
}

Modal.Body = ModalBody;
Modal.Overlay = ModalOverlay;
Modal.Content = ModalContent;
Modal.Header = ModalHeader;
