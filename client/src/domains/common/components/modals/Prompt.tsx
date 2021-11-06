import {
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
} from "@chakra-ui/modal";
import Button from "../styles/button";

interface IProps {
    isOpen: boolean;
    onClose(): void;
    onSubmit(): void;
    body: string;
    header: string;
}

export function Prompt({ isOpen, onClose, body, header, onSubmit }: IProps) {
    return (
        <Modal blockScrollOnMount isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{header}</ModalHeader>
                <ModalBody>{body}</ModalBody>
                <ModalFooter>
                    <Button.Primary mr="1rem" onClick={onSubmit}>
                        Ok
                    </Button.Primary>
                    <Button.Ghost onClick={onClose}>Cancel</Button.Ghost>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
