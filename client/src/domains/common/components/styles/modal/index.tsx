import ModalBody from "./Body";
import ModalHeader from "./Header";
import ModalContent from "./Content";
import ModalOverlay from "./Overlay";
import { Box, Flex, FlexProps } from "@chakra-ui/layout";
import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useOnClickOutside } from "domains/common/hooks";

interface IModalProps {
    onClose?(): void;
    isOpen?: boolean;
    blockScrollOnMount?: boolean;
    onClickOutside?(): void;
    children: React.ReactNode;
    style?: FlexProps;
}

export default function Modal(props: IModalProps) {
    const wrapperEl = useOnClickOutside<HTMLDivElement>(props.onClickOutside);

    useEffect(() => {
        if (props.blockScrollOnMount) {
            document.body.style.overflowY = props.isOpen ? "hidden" : "";
        }
    }, [props.blockScrollOnMount, props.isOpen]);

    useEffect(() => {
        return () => {
            document.body.style.overflowY = "";
        };
    }, []);

    return (
        <Box ref={wrapperEl}>
            <AnimatePresence>
                {props.isOpen && (
                    <Flex
                        exit={{ top: "8rem", opacity: 0 }}
                        animate={{ top: "10rem", opacity: 1 }}
                        top="8rem"
                        pos="fixed"
                        transform="translateX(-50%)"
                        left="50%"
                        bgColor="primary.darkest"
                        zIndex={100000}
                        rounded="base"
                        boxShadow="0 0 30px 0 rgba(0, 0, 0, 0.5)"
                        {...props.style}
                    >
                        {props.children}
                    </Flex>
                )}
            </AnimatePresence>
        </Box>
    );
}

Modal.Body = ModalBody;
Modal.Overlay = ModalOverlay;
Modal.Content = ModalContent;
Modal.Header = ModalHeader;
