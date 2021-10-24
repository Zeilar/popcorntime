import { Input } from "@chakra-ui/input";
import { Box, Flex } from "@chakra-ui/layout";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { IMessage } from "../../@types/message";
import { ISocket } from "../../@types/socket";
import { socket } from "./App";

interface IProps {
    roomId: string;
    sockets: ISocket[];
    me: ISocket | undefined;
}

export default function Chat({ roomId, sockets, me }: IProps) {
    const [isOpen, setIsOpen] = useState(true); // useLocalStorage for initial value
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<IMessage[]>([]);

    useEffect(() => {
        socket.on("message:new", (message: IMessage) => {
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

    if (!isOpen) {
        return null;
    }

    function sendMessage(e: FormEvent) {
        e.preventDefault();
        setInput("");
        if (!input || !me) {
            return; // Chat should be loading at this state, this clause should in theory never run however
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

    return (
        <Flex flexDir="column" bgColor="gray.800">
            {messages.map((message) => (
                <Box
                    key={message.id}
                    className={message.notSent ? "not-sent" : undefined}
                >
                    {message.socket.username}: <strong>{message.body}</strong>{" "}
                    {message.notSent && "NOT SENT"}
                </Box>
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
