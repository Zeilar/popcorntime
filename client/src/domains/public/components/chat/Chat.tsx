import { Box, Divider, Flex } from "@chakra-ui/layout";
import {
    KeyboardEvent,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { IMessage } from "domains/common/@types/message";
import { ISocket } from "domains/common/@types/socket";
import Message from "domains/common/components/ChatMessage";
import Textarea from "../styles/Textarea";
import { MeContext } from "../../contexts";
import { ChatSettings } from "./";
import { useLocalStorage, useOnClickOutside } from "domains/common/hooks";
import { WebsocketContext } from "domains/common/contexts";
import Button from "domains/common/components/styles/button";
import { ChatContext } from "domains/public/contexts/ChatContext";

interface IProps {
    roomId: string;
    sockets: ISocket[];
}

export function Chat({ roomId }: IProps) {
    const [showChat, setShowChat] = useLocalStorage<boolean>("showChat", true);
    const { showServerMessages } = useContext(ChatContext);
    const { me } = useContext(MeContext);
    const [isOpen, setIsOpen] = useState(showChat);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const scrollChat = useRef<boolean>(true);
    const chatElement = useRef<HTMLDivElement>(null);
    const input = useRef<HTMLTextAreaElement>(null);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const { publicSocket } = useContext(WebsocketContext);
    const settingsEl = useOnClickOutside<HTMLDivElement>(() => {
        setSettingsOpen(false);
    });

    const { REACT_APP_ROOM_MAX_MESSAGES } = process.env;

    useEffect(() => {
        setShowChat(isOpen);
    }, [isOpen, setShowChat]);

    const addMessage = useCallback(
        (message: IMessage) => {
            setMessages(messages => {
                const array = [...messages, message];
                if (array.length > parseInt(REACT_APP_ROOM_MAX_MESSAGES)) {
                    array.shift();
                }
                return array;
            });
        },
        [REACT_APP_ROOM_MAX_MESSAGES]
    );

    function toggle() {
        setIsOpen(isOpen => !isOpen);
    }

    useEffect(() => {
        publicSocket.on("message:new", (message: IMessage) => {
            scrollChat.current = true;
            addMessage(message);
        });

        publicSocket.on(
            "message:error",
            (payload: { id: string; error: string }) => {
                setMessages(messages =>
                    messages.map(message => {
                        // If message already had en error, do nothing
                        if (message.notSent) {
                            return message;
                        }
                        return {
                            ...message,
                            notSent: message.id === payload.id,
                        };
                    })
                );
                toast.error(payload.error);
            }
        );

        publicSocket.once("room:join", (payload: { messages: IMessage[] }) => {
            setMessages(payload.messages);
        });

        return () => {
            publicSocket
                .off("message:new")
                .off("message:error")
                .off("room:join");
        };
    }, [addMessage, publicSocket]);

    function sendMessage() {
        if (!input.current) {
            return;
        }
        const body = input.current.value;
        if (!body) {
            return;
        }
        input.current.value = "";
        const message: IMessage = {
            body,
            created_at: new Date(),
            id: uuidv4(),
            socket: me,
        };
        addMessage(message);
        publicSocket.emit("message:send", { roomId, body, id: message.id });
    }

    function inputHandler(e: KeyboardEvent) {
        if (!e.shiftKey && e.key === "Enter") {
            e.preventDefault();
            sendMessage();
        }
    }

    function toggleSettings() {
        setSettingsOpen(open => !open);
    }

    useEffect(() => {
        scrollChat.current = false;
        chatElement.current?.scrollTo({ top: 9999, behavior: "smooth" });
    }, [messages, showServerMessages]);

    const filteredMessages = showServerMessages
        ? messages
        : messages.filter(message => !message.serverMessage);

    return (
        <Flex
            flexDir="column"
            h="100vh"
            bgColor="gray.800"
            w={isOpen ? "25rem" : "3.5rem"}
        >
            <Flex align="center" p="0.5rem">
                {isOpen ? (
                    <Button.Icon
                        onClick={toggle}
                        tooltip="Close chat"
                        ml="auto"
                        mdi="mdiArrowCollapseRight"
                    />
                ) : (
                    <Button.Icon
                        onClick={toggle}
                        tooltip="Open chat"
                        ml="auto"
                        mdi="mdiArrowExpandLeft"
                    />
                )}
            </Flex>
            <Divider />
            {isOpen && (
                <>
                    <Flex
                        className="custom-scrollbar scrollbar-inset"
                        flexDir="column"
                        overflowY="auto"
                        p="0.5rem"
                        ref={chatElement}
                    >
                        {filteredMessages.map(message => (
                            <Message key={message.id} message={message} />
                        ))}
                    </Flex>
                    <Divider mt="auto" />
                    <Box as="form" onSubmit={sendMessage} p="1rem">
                        <Textarea
                            onKeyDown={inputHandler}
                            forwardRef={input}
                            placeholder="Send a message"
                            resize="none"
                        />
                    </Box>
                    <Box px="1rem" pb="1rem">
                        <Box pos="relative" ref={settingsEl}>
                            <Button.Icon
                                tooltip="Settings"
                                mdi="mdiCog"
                                onClick={toggleSettings}
                            />
                            {settingsOpen && <ChatSettings />}
                        </Box>
                    </Box>
                </>
            )}
        </Flex>
    );
}
