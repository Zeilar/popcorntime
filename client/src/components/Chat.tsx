import { Input } from "@chakra-ui/input";
import { Box, Flex } from "@chakra-ui/layout";
import { FormEvent, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { IMessage } from "../../@types/message";
import { ISocket } from "../../@types/socket";
import { socket } from "./App";
import Message from "./Message";

interface IProps {
    roomId: string;
    sockets: ISocket[];
    me: ISocket;
}

export default function Chat({ roomId, sockets, me }: IProps) {
    const [isOpen, setIsOpen] = useState(true); // useLocalStorage for initial value
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<IMessage[]>([]);
    const scrollChat = useRef<boolean>(true);
    const chatElement = useRef<HTMLDivElement>(null);

    useEffect(() => {
        socket.on("message:new", (message: IMessage) => {
            scrollChat.current = true;
            setMessages((messages) => [...messages, message]);
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

        return () => {
            socket.off("message:new").off("message:error");
        };
    }, []);

    function sendMessage(e: FormEvent) {
        e.preventDefault();
        setInput("");
        if (!input) {
            return;
        }
        const message: IMessage = {
            body: input,
            created_at: new Date(),
            id: uuidv4(),
            socket: me,
        };
        setMessages((messages) => [...messages, message]);
        socket.emit("message:send", { roomId, body: input, id: message.id });
    }

    useEffect(() => {
        scrollChat.current = false;
        chatElement.current?.scrollTo({ top: 9999 });
    }, [messages]);

    if (!isOpen) {
        return null;
    }

    return (
        <Flex
            flexDir="column"
            bgColor="gray.800"
            overflowY="auto"
            overflowX="hidden"
            p="1rem"
            ref={chatElement}
        >
            {messages.map((message) => (
                <Message key={message.id} message={message} />
            ))}
            <Box as="form" onSubmit={sendMessage}>
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
            </Box>
            <Flex flexDir="column" gridGap="1rem">
                {sockets.map((socket) => (
                    <Box key={socket.id} bgColor={`${socket.color}.800`}>
                        {socket.username}
                    </Box>
                ))}
            </Flex>
        </Flex>
    );
}
