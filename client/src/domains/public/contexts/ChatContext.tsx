import { createContext, ReactNode } from "react";
import { useLocalStorage } from "domains/common/hooks";

interface IContext {
    showServerMessages: boolean | null;
    setShowServerMessages: React.Dispatch<React.SetStateAction<boolean>>;
}

interface IProps {
    children: ReactNode;
}

export const ChatContext = createContext({} as IContext);

export function ChatContextProvider({ children }: IProps) {
    const [showServerMessages, setShowServerMessages] = useLocalStorage(
        "showServerMessages:chat",
        true
    );

    const values: IContext = {
        showServerMessages,
        setShowServerMessages,
    };

    return (
        <ChatContext.Provider value={values}>{children}</ChatContext.Provider>
    );
}
