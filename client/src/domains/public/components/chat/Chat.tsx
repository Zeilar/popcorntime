import { Box, Divider, Flex, Text } from "@chakra-ui/layout";
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
import Message from "domains/common/components/ChatMessage";
import Textarea from "../styles/Textarea";
import { MeContext, RoomContext } from "domains/public/contexts";
import { ChatSettings } from "./";
import { useLocalStorage, useOnClickOutside } from "domains/common/hooks";
import { WebsocketContext } from "domains/common/contexts";
import Button from "domains/common/components/styles/button";
import { IErrorPayload } from "domains/common/@types/listener";
import { useDisclosure } from "@chakra-ui/hooks";
import RoomInfo from "./RoomInfo";
import { IRoomParams } from "domains/public/@types/params";
import { useParams } from "react-router";
import env from "config/env";
import ChatName from "./ChatName";

export function Chat() {
    const [showChat, setShowChat] = useLocalStorage<boolean>("showChat", true);
    const { showServerMessages } = useContext(RoomContext);
    const { roomId } = useParams<IRoomParams>();
    const { me } = useContext(MeContext);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const scrollChat = useRef<boolean>(true);
    const chatElement = useRef<HTMLDivElement>(null);
    const input = useRef<HTMLTextAreaElement>(null);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const { publicSocket } = useContext(WebsocketContext);
    const roomInfo = useDisclosure();
    const settingsEl = useOnClickOutside<HTMLDivElement>(() => {
        setSettingsOpen(false);
    });

    const addMessage = useCallback((message: IMessage) => {
        setMessages(messages => {
            const array = [...messages, message];
            const socketMessages = array.filter(
                message => !message.serverMessage
            );
            if (socketMessages.length > env.ROOM_MAX_MESSAGES) {
                array.shift();
            }
            return array;
        });
    }, []);

    function toggle() {
        setShowChat(p => !p);
    }

    useEffect(() => {
        publicSocket.on("message:new", (message: IMessage) => {
            scrollChat.current = true;
            addMessage(message);
        });

        publicSocket.on(
            "message:error",
            (payload: IErrorPayload & { id: string }) => {
                setMessages(messages =>
                    messages.map(message =>
                        message.notSent
                            ? message
                            : {
                                  ...message,
                                  notSent: message.id === payload.id,
                              }
                    )
                );
                toast.error(`${payload.message} ${payload.reason}`);
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
    }, [messages]);

    useEffect(() => {
        chatElement.current?.scrollTo({ top: 9999 });
    }, [showServerMessages, showChat]);

    const filteredMessages = showServerMessages
        ? messages
        : messages.filter(message => !message.serverMessage);

    return (
        <Flex
            flexDir="column"
            w={showChat ? "25rem" : "3rem"}
            zIndex={10}
            pos="relative"
        >
            {roomInfo.isOpen && <RoomInfo onClose={roomInfo.onClose} />}
            <Flex
                align="center"
                p="0.5rem"
                justifyContent="space-between"
                boxShadow="elevate.bottom"
                zIndex={env.ROOM_MAX_MESSAGES + 5}
            >
                {showChat ? (
                    <Button.Icon
                        onClick={toggle}
                        tooltip="Hide chat"
                        mdi="mdiArrowCollapseRight"
                    />
                ) : (
                    <Button.Icon
                        onClick={toggle}
                        tooltip="Show chat"
                        mdi="mdiArrowExpandLeft"
                    />
                )}
                {showChat && (
                    <>
                        <Text fontWeight={600}>Chat</Text>
                        <Button.Icon
                            mdi="mdiInformationOutline"
                            onClick={roomInfo.onOpen}
                            tooltip="Room details"
                        />
                    </>
                )}
            </Flex>
            <Divider />
            {showChat && (
                <>
                    <Flex flexDir="column" overflowY="auto" ref={chatElement}>
                        {filteredMessages.map((message, i) => (
                            <Message
                                key={message.id}
                                message={message}
                                index={i}
                            />
                        ))}
                    </Flex>
                    <Box zIndex={env.ROOM_MAX_MESSAGES + 5} mt="auto">
                        <Box h={2} boxShadow="elevate.top" />
                        <Box as="form" onSubmit={sendMessage} p="1rem">
                            <Text
                                display="inline-flex"
                                color={`${me.color}.600`}
                                mb="0.75rem"
                                fontWeight={700}
                            >
                                <ChatName socket={me} />
                            </Text>
                            <Textarea
                                autoFocus
                                onKeyDown={inputHandler}
                                forwardRef={input}
                                placeholder="Send a message"
                                resize="none"
                                bgColor="gray.400"
                                border="none"
                                _focus={{
                                    bgColor: "gray.100",
                                    boxShadow: "outline",
                                }}
                            />
                        </Box>
                        <Box px="1rem" mb="1rem">
                            <Flex pos="relative">
                                <Box pos="relative" ref={settingsEl}>
                                    <Button.Icon
                                        tooltip="Settings"
                                        mdi="mdiCog"
                                        onClick={toggleSettings}
                                    />
                                    {settingsOpen && <ChatSettings />}
                                </Box>
                                <Button.Icon
                                    tooltip="Send"
                                    ml="auto"
                                    mdi="mdiSend"
                                    onClick={sendMessage}
                                />
                            </Flex>
                        </Box>
                    </Box>
                </>
            )}
        </Flex>
    );
}
