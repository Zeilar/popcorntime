import { useDisclosure } from "@chakra-ui/hooks";
import { createContext } from "react";

interface IPasswordPromptModalContext {
    isOpen: boolean;
    onClose(): void;
    onOpen(): void;
}

interface PasswordPromptModalProps {
    children: React.ReactNode;
}

export const PasswordPromptModalContext = createContext(
    {} as IPasswordPromptModalContext
);

export function PasswordPromptModalContextProvider({
    children,
}: PasswordPromptModalProps) {
    const { isOpen, onClose, onOpen } = useDisclosure();

    const values: IPasswordPromptModalContext = {
        isOpen,
        onClose,
        onOpen,
    };

    return (
        <PasswordPromptModalContext.Provider value={values}>
            {children}
        </PasswordPromptModalContext.Provider>
    );
}
