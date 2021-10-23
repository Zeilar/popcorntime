import { Input } from "@chakra-ui/input";
import { Box, Flex } from "@chakra-ui/layout";
import { FormEvent, useEffect, useState } from "react";
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

        return () => {
            socket.off("message:new");
        };
    }, []);

    if (!isOpen) {
        return null;
    }

    function sendMessage(e: FormEvent) {
        e.preventDefault();
        if (!input) {
            return;
        }
        setInput("");
        socket.emit("message:send", { roomId, body: input });
    }

    return (
        <Flex flexDir="column" bgColor="gray.800">
            {messages.map((message) => (
                <Box key={message.id}>
                    {message.socket.id}: <strong>{message.body}</strong>
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
                    <Box
                        key={socket.id}
                        bgColor={socket.id === me?.id ? "blue.600" : "gray.600"}
                    >
                        {socket.id}
                    </Box>
                ))}
            </Flex>
        </Flex>
    );
}
