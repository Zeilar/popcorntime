import { Box, Flex } from "@chakra-ui/layout";
import { KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { IMessage } from "../../@types/message";
import { IMetaData } from "../../@types/room";
import { ISocket } from "../../@types/socket";
import { socket } from "./App";
import Message from "./Message";
import Textarea from "./styles/Textarea";

interface IProps {
    roomId: string;
    sockets: ISocket[];
    me: ISocket;
}

export default function Chat({ roomId, me }: IProps) {
    const [isOpen, setIsOpen] = useState(true); // useLocalStorage for initial value
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [metaData, setMetaData] = useState<IMetaData>({
        MAX_MESSAGES: 30,
        MAX_SOCKETS: 10,
    });
    const scrollChat = useRef<boolean>(true);
    const chatElement = useRef<HTMLDivElement>(null);
    const input = useRef<HTMLTextAreaElement>(null);

    function addMessage(message: IMessage) {
        setMessages((messages) => {
            const array = [...messages, message];
            if (array.length > metaData.MAX_MESSAGES) {
                array.shift();
            }
            return array;
        });
    }

    useEffect(() => {
        socket.on("message:new", (message: IMessage) => {
            scrollChat.current = true;
            addMessage(message);
        });

        socket.on("message:error", (payload: { id: string; error: string }) => {
            setMessages((messages) =>
                [...messages].map((message) => {
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
        });

        socket.once(
            "room:join",
            (payload: { messages: IMessage[]; metaData: IMetaData }) => {
                setMetaData(payload.metaData);
                setMessages(payload.messages);
            }
        );

        return () => {
            socket.off("message:new").off("message:error").off("room:join");
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
        socket.emit("message:send", { roomId, body, id: message.id });
    }

    function inputHandler(e: KeyboardEvent) {
        if (!e.shiftKey && e.key === "Enter") {
            e.preventDefault();
            sendMessage();
        }
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
        </Flex>
    );
}
