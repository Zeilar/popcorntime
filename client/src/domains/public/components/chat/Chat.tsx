import { Box, Flex, Text } from "@chakra-ui/layout";
import { useContext, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { IMessage } from "domains/common/@types/message";
import Message from "domains/common/components/ChatMessage";
import { MeContext, RoomContext } from "domains/public/contexts";
import { useLocalStorage } from "domains/common/hooks";
import { WebsocketContext } from "domains/public/contexts";
import Button from "domains/common/components/styles/button";
import { IErrorPayload } from "domains/common/@types/listener";
import { useDisclosure } from "@chakra-ui/hooks";
import RoomInfo from "./RoomInfo";
import { IRoomParams } from "domains/public/@types/params";
import { useParams } from "react-router";
import env from "config/env";
import ChatName from "./ChatName";
import { Textarea } from "@chakra-ui/textarea";
import * as Popover from "@chakra-ui/popover";
import { Switch } from "@chakra-ui/switch";

export function Chat() {
    const [showChat, setShowChat] = useLocalStorage<boolean>("showChat", true);
    const {
        showServerMessages,
        setShowServerMessages,
        messages,
        setMessages,
        addMessage,
    } = useContext(RoomContext);
    const { roomId } = useParams<IRoomParams>();
    const { me } = useContext(MeContext);
    const scrollChat = useRef<boolean>(true);
    const chatElement = useRef<HTMLDivElement>(null);
    const input = useRef<HTMLTextAreaElement>(null);
    const { publicSocket } = useContext(WebsocketContext);
    const roomInfo = useDisclosure();

    function toggle() {
        setShowChat(p => !p);
    }

    useEffect(() => {
        publicSocket.on("message:new", (message: IMessage) => {
            scrollChat.current = true;
            addMessage(message);
        });
        return () => {
            publicSocket.off("message:new");
        };
    }, [addMessage, publicSocket]);

    useEffect(() => {
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
        return () => {
            publicSocket.off("message:error");
        };
    }, [publicSocket, setMessages]);

    function sendMessage() {
        if (!input.current || !me) {
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

    function inputHandler(e: React.KeyboardEvent) {
        if (!e.shiftKey && e.key === "Enter") {
            e.preventDefault();
            sendMessage();
        }
    }

    useEffect(() => {
        scrollChat.current = false;
        chatElement.current?.scrollTo({ top: 9999 });
    }, [messages]);

    useEffect(() => {
        chatElement.current?.scrollTo({ top: 9999 });
    }, [showServerMessages, showChat]);

    const filteredMessages = showServerMessages
        ? messages
        : messages.filter(message => !message.serverMessage);

    function SettingsPopover() {
        return (
            <Popover.Popover closeOnBlur={false} placement="top-start">
                {({ onClose }) => (
                    <>
                        <Popover.PopoverTrigger>
                            <Box>
                                <Button.Icon tooltip="Settings" mdi="mdiCog" />
                            </Box>
                        </Popover.PopoverTrigger>
                        <Popover.PopoverContent>
                            <Button.Icon
                                right="0.5rem"
                                top="0.5rem"
                                pos="absolute"
                                mdi="mdiClose"
                                onClick={onClose}
                            />
                            <Popover.PopoverHeader>
                                Settings
                            </Popover.PopoverHeader>
                            <Popover.PopoverBody>
                                <Text size="lg" mb="0.5rem">
                                    Show server messages
                                </Text>
                                <Switch
                                    isChecked={showServerMessages}
                                    onChange={e =>
                                        setShowServerMessages(e.target.checked)
                                    }
                                />
                            </Popover.PopoverBody>
                        </Popover.PopoverContent>
                    </>
                )}
            </Popover.Popover>
        );
    }

    function TopBar() {
        return (
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
                        <Text
                            fontWeight={600}
                            textTransform="uppercase"
                            fontSize="sm"
                        >
                            Chat
                        </Text>
                        <Button.Icon
                            mdi="mdiInformationOutline"
                            onClick={roomInfo.onOpen}
                            tooltip="Room details"
                        />
                    </>
                )}
            </Flex>
        );
    }

    function Messages() {
        return (
            <Flex flexDir="column" overflowY="auto" ref={chatElement}>
                {filteredMessages.map((message, i) => (
                    <Message key={message.id} message={message} index={i} />
                ))}
            </Flex>
        );
    }

    function BottomBar() {
        return (
            <Box px="1rem" mb="1rem">
                <Flex pos="relative">
                    <SettingsPopover />
                    <Button.Icon
                        tooltip="Send"
                        ml="auto"
                        mdi="mdiSend"
                        onClick={sendMessage}
                    />
                </Flex>
            </Box>
        );
    }

    function ChatInput() {
        return (
            <Box as="form" onSubmit={sendMessage} p="1rem">
                {me && (
                    <Text
                        display="inline-flex"
                        color={`${me.color}.600`}
                        mb="0.75rem"
                        fontWeight={700}
                    >
                        {publicSocket.connected && <ChatName socket={me} />}
                    </Text>
                )}
                <Textarea
                    onKeyDown={inputHandler}
                    ref={input}
                    placeholder="Send a message"
                    resize="none"
                />
            </Box>
        );
    }

    return (
        <Flex
            flexDir="column"
            w={showChat ? "25rem" : "3rem"}
            zIndex={10}
            pos="relative"
            boxShadow="elevate.left"
            bgColor="gray.600"
        >
            {roomInfo.isOpen && <RoomInfo onClose={roomInfo.onClose} />}
            <TopBar />
            {showChat && (
                <>
                    <Messages />
                    <Box zIndex={env.ROOM_MAX_MESSAGES + 5} mt="auto">
                        <Box h="2px" boxShadow="elevate.top" />
                        <ChatInput />
                        <BottomBar />
                    </Box>
                </>
            )}
        </Flex>
    );
}
