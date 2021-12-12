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
    noCancel?: boolean;
}

export function Prompt(props: IProps) {
    const noCancelStyling = props.noCancel
        ? {
              w: "100%",
          }
        : {
              mr: "0.5rem",
          };

    function submit() {
        props.onClose();
        props.onSubmit();
    }

    return (
        <Modal blockScrollOnMount isOpen={props.isOpen} onClose={props.onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{props.header}</ModalHeader>
                <ModalBody>{props.body}</ModalBody>
                <ModalFooter>
                    <Button
                        variant="primary"
                        onClick={submit}
                        {...noCancelStyling}
                    >
                        Ok
                    </Button>
                    {!props.noCancel && (
                        <Button variant="ghost" onClick={props.onClose}>
                            Cancel
                        </Button>
                    )}
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
