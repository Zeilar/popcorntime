import { Box, Flex } from "@chakra-ui/layout";
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
import Icon from "../styles/icon";
import { MeContext } from "../../contexts";
import { ChatSettings } from ".";
import { useOnClickOutside } from "common/hooks";
import { SocketContext } from "domains/common/contexts";

interface IProps {
    roomId: string;
    sockets: ISocket[];
}

export function Chat({ roomId }: IProps) {
    const { me } = useContext(MeContext);
    const [isOpen, setIsOpen] = useState(true); // useLocalStorage for initial value
    const [messages, setMessages] = useState<IMessage[]>([]);
    const scrollChat = useRef<boolean>(true);
    const chatElement = useRef<HTMLDivElement>(null);
    const input = useRef<HTMLTextAreaElement>(null);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const { publicSocket } = useContext(SocketContext);
    const settingsEl = useOnClickOutside<HTMLDivElement>(() =>
        setSettingsOpen(false)
    );

    const { REACT_APP_ROOM_MAX_MESSAGES } = process.env;

    const addMessage = useCallback(
        (message: IMessage) => {
            setMessages((messages) => {
                const array = [...messages, message];
                if (array.length > parseInt(REACT_APP_ROOM_MAX_MESSAGES)) {
                    array.shift();
                }
                return array;
            });
        },
        [REACT_APP_ROOM_MAX_MESSAGES]
    );

    useEffect(() => {
        publicSocket.on("message:new", (message: IMessage) => {
            scrollChat.current = true;
            addMessage(message);
        });

        publicSocket.on(
            "message:error",
            (payload: { id: string; error: string }) => {
                setMessages((messages) =>
                    messages.map((message) => {
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
    }, [addMessage]);

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
        setSettingsOpen((open) => !open);
    }

    useEffect(() => {
        scrollChat.current = false;
        chatElement.current?.scrollTo({ top: 9999, behavior: "smooth" });
    }, [messages]);

    if (!isOpen) {
        return null;
    }

    return (
        <Flex flexDir="column" h="100vh" bgColor="whiteAlpha.50">
            <Flex
                className="custom-scrollbar"
                flexDir="column"
                overflowY="auto"
                overflowX="hidden"
                p="0.5rem"
                ref={chatElement}
            >
                {messages.map((message) => (
                    <Message key={message.id} message={message} />
                ))}
            </Flex>
            <Box as="form" onSubmit={sendMessage} mt="auto" p="1rem">
                <Textarea
                    onKeyDown={inputHandler}
                    forwardRef={input}
                    placeholder="Send a message"
                    resize="none"
                />
            </Box>
            <Box p="0.5rem">
                <Box pos="relative" w="1rem" h="1rem" ref={settingsEl}>
                    <Icon.Settings onClick={toggleSettings} />
                    {settingsOpen && <ChatSettings />}
                </Box>
            </Box>
        </Flex>
    );
}
