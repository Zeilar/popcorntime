import ModalBody from "./Body";
import ModalHeader from "./Header";
import ModalContent from "./Content";
import ModalOverlay from "./Overlay";
import { Flex, FlexProps } from "@chakra-ui/layout";
import { useEffect } from "react";
import { useOnClickOutside } from "domains/common/hooks";

interface IModalProps {
    onClose(): void;
    isOpen?: boolean;
    blockScrollOnMount?: boolean;
    closeOnOutsideClick?: boolean;
    children: React.ReactNode;
    style?: FlexProps;
}

export default function Modal(props: IModalProps) {
    const wrapperEl = useOnClickOutside<HTMLDivElement>(() => {
        if (props.isOpen && props.closeOnOutsideClick) {
            props.onClose();
        }
    });

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

    return props.isOpen ? (
        <Flex
            ref={wrapperEl}
            top="10rem"
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
    ) : null;
}

Modal.Body = ModalBody;
Modal.Overlay = ModalOverlay;
Modal.Content = ModalContent;
Modal.Header = ModalHeader;
