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
    body: JSX.Element | string;
    header: string;
}

export function Prompt({ isOpen, onClose, body, header, onSubmit }: IProps) {
    function submit() {
        onClose();
        onSubmit();
    }
    return (
        <Modal blockScrollOnMount isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{header}</ModalHeader>
                <ModalBody>{body}</ModalBody>
                <ModalFooter mt="1rem">
                    <Button.Primary mr="0.5rem" onClick={submit}>
                        Ok
                    </Button.Primary>
                    <Button.Ghost onClick={onClose}>Cancel</Button.Ghost>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
