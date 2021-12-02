import ModalBody from "./Body";
import ModalHeader from "./Header";
import ModalContent from "./Content";
import ModalOverlay from "./Overlay";
import { Flex, FlexProps } from "@chakra-ui/layout";
import { useEffect } from "react";
import { motion } from "framer-motion";

interface IModalProps extends FlexProps {
    onClose(): void;
    isOpen?: boolean;
    blockScrollOnMount?: boolean;
}

const Motion = motion<FlexProps>(Flex);

const animations = {
    visible: {
        top: "10rem",
        opacity: 1,
    },
    hidden: {
        top: "0rem",
        opacity: 0,
    },
};

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
        <Motion
            animate={isOpen ? "visible" : "hidden"}
            variants={animations}
            pos="fixed"
            transform="translateX(-50%)"
            left="50%"
            top="10rem"
            bgColor="gray.600"
            zIndex={100000}
            rounded="base"
            boxShadow="0 0 30px 0 rgba(0, 0, 0, 0.5)"
            opacity={isOpen ? 1 : 0}
            {...(props as any)}
        >
            {children}
        </Motion>
    );
}

Modal.Body = ModalBody;
Modal.Overlay = ModalOverlay;
Modal.Content = ModalContent;
Modal.Header = ModalHeader;
