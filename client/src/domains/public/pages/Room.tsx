import { useContext, useEffect, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router";
import { ISocket } from "domains/common/@types/socket";
import { toast } from "react-toastify";
import { Chat } from "../components/chat";
import { Flex } from "@chakra-ui/react";
import { Color } from "domains/common/@types/color";
import {
    MeContext,
    PasswordPromptModalContext,
    WebsocketContext,
} from "domains/public/contexts";
import { IErrorPayload } from "domains/common/@types/listener";
import { RoomContext } from "../contexts";
import Player from "../components/Player";
import { IRoomParams } from "../@types/params";
import { IRoom } from "domains/common/@types/room";
import Modal from "domains/common/components/styles/modal";
import Alert from "domains/common/components/styles/alert";
import { Input } from "@chakra-ui/input";
import Button from "domains/common/components/styles/button";
import { useLocalStorage, useTitle } from "domains/common/hooks";
import { RoomActions } from "../state/actions/room";
import { Text } from "@chakra-ui/layout";
import { Checkbox } from "@chakra-ui/checkbox";

export function Room() {
    const { roomId } = useParams<IRoomParams>();
    const { publicSocket } = useContext(WebsocketContext);
    const { push } = useHistory();
    const {
        dispatchSockets,
        setRoom,
        setLeader,
        room,
        setMessages,
        setAuthorized,
    } = useContext(RoomContext);
    const { me } = useContext(MeContext);
    const passwordPrompt = useContext(PasswordPromptModalContext);
    const [submittingPassword, setSubmittingPassword] = useState(false);
    const location = useLocation<{ password?: string } | undefined>();
    const [rememberPassword, setRememberPassword] = useLocalStorage(
        "room-remember-password",
        false
    );
    const [storedPassword, setStoredPassword] = useLocalStorage(
        `room-${roomId}-password`,
        ""
    );
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState<null | string>(null);

    function authorize(e: React.FormEvent) {
        e.preventDefault();
        if (!password) {
            return;
        }
        setSubmittingPassword(true);
        publicSocket.emit("room:join", { roomId, password });
    }

    useTitle(room && `SyncedTube | ${room.name}`);

    useEffect(() => {
        if (rememberPassword && passwordPrompt.isOpen) {
            setPassword(storedPassword);
        }
    }, [storedPassword, passwordPrompt.isOpen, rememberPassword]);

    useEffect(() => {
        publicSocket.on("room:join", (payload: IRoom) => {
            dispatchSockets({
                type: RoomActions.SET_SOCKETS,
                sockets: payload.sockets,
            });
            setRoom({
                id: payload.id,
                name: payload.name,
                created_at: payload.created_at,
                leader: payload.leader,
                privacy: payload.privacy,
                videoId: payload.videoId,
            });
            setMessages(payload.messages);
            setSubmittingPassword(false);
            setPasswordError(null);
            setAuthorized(true);
            if (rememberPassword) {
                setStoredPassword(location.state?.password ?? password);
            }
            passwordPrompt.onClose();
        });
        return () => {
            publicSocket.off("room:join");
        };
    }, [
        publicSocket,
        dispatchSockets,
        setRoom,
        passwordPrompt,
        setMessages,
        setStoredPassword,
        password,
        rememberPassword,
        room?.privacy,
        location.state?.password,
        setAuthorized,
    ]);

    useEffect(() => {
        publicSocket.on("room:socket:join", (socket: ISocket) => {
            dispatchSockets({
                type: RoomActions.ADD_SOCKET,
                socket,
            });
        });
        publicSocket.on("room:socket:leave", (socket: ISocket) => {
            dispatchSockets({
                type: RoomActions.REMOVE_SOCKET,
                socketId: socket.id,
            });
        });
        publicSocket.on(
            "room:socket:update:color",
            (payload: { color: Color; socketId: string }) => {
                dispatchSockets({
                    type: RoomActions.EDIT_SOCKET_COLOR,
                    ...payload,
                });
            }
        );
        return () => {
            publicSocket
                .off("room:socket:join")
                .off("room:socket:leave")
                .off("room:socket:update:color");
        };
    }, [publicSocket, dispatchSockets]);

    useEffect(() => {
        publicSocket.on("room:kick", () => {
            toast.info("You were kicked from the room.");
            push("/");
        });
        publicSocket.on("room:destroy", () => {
            toast.info("The room has been shut down.");
            push("/");
        });
        publicSocket.on("room:connection:error", (payload: IErrorPayload) => {
            toast.error(`${payload.message}\${payload.reason}`);
            push("/");
        });
        return () => {
            publicSocket
                .off("room:kick")
                .off("room:destroy")
                .off("room:connection:error");
        };
    }, [publicSocket, push]);

    useEffect(() => {
        publicSocket.on("room:leader:new", (leader: string | null) => {
            if (me && me.id === leader) {
                toast.info("You are now the room leader.");
            }
            setLeader(leader);
        });
        return () => {
            publicSocket.off("room:leader:new");
        };
    }, [publicSocket, setRoom, me, setLeader]);

    useEffect(() => {
        publicSocket.on("socket:kick", () => {
            toast.info("You were kicked from the server.");
        });
        publicSocket.on("disconnect", () => {
            setSubmittingPassword(false);
        });
        return () => {
            publicSocket.off("socket:kick");
        };
    }, [publicSocket]);

    useEffect(() => {
        publicSocket.emit("room:join", {
            roomId,
            password: location.state?.password,
        });
    }, [publicSocket, location.state?.password, roomId]);

    useEffect(() => {
        return () => {
            publicSocket.emit("room:leave", roomId);
        };
    }, [publicSocket, roomId]);

    useEffect(() => {
        publicSocket.on("room:error:password", () => {
            setSubmittingPassword(false);
            setPasswordError("Incorrect password.");
            setAuthorized(false);
            passwordPrompt.onOpen();
        });
        publicSocket.on("room:unauthorized", () => {
            setAuthorized(false);
            passwordPrompt.onOpen();
        });
        return () => {
            publicSocket.off("room:error:password").off("room:unauthorized");
        };
    }, [publicSocket, passwordPrompt, setAuthorized]);

    useEffect(() => {
        return () => {
            setMessages([]);
            setRoom(null);
            setPassword("");
            dispatchSockets({
                type: RoomActions.SET_SOCKETS,
                sockets: [],
            });
        };
    }, [roomId, setRoom, setMessages, dispatchSockets]);

    return (
        <Flex flexGrow={1} maxH="100%" overflow="hidden">
            <Modal.Overlay isOpen={passwordPrompt.isOpen} />
            <Modal
                onClose={passwordPrompt.onClose}
                isOpen={passwordPrompt.isOpen}
                closeOnOutsideClick
            >
                <Modal.Content>
                    <Modal.Body>
                        <Modal.Header as="h3">
                            Please enter the password
                        </Modal.Header>
                        {passwordError && (
                            <Alert.Error mb="0.5rem">
                                <Text>{passwordError}</Text>
                            </Alert.Error>
                        )}
                        <Flex flexDir="column" as="form" onSubmit={authorize}>
                            <Input
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                type="password"
                                autoFocus
                                bgColor="primary.dark"
                                placeholder="••••••••••"
                            />
                            <Flex mt="0.5rem">
                                <Checkbox
                                    isChecked={rememberPassword}
                                    onChange={e =>
                                        setRememberPassword(e.target.checked)
                                    }
                                    mr="0.5rem"
                                    id="room-password-prompt-remember"
                                />
                                <Text
                                    as="label"
                                    htmlFor="room-password-prompt-remember"
                                    userSelect="none"
                                    cursor="pointer"
                                >
                                    Remember password
                                </Text>
                            </Flex>
                            <Button
                                mt="2rem"
                                variant="primary"
                                type="submit"
                                isLoading={submittingPassword}
                                size="btn-lg"
                            >
                                Submit
                            </Button>
                        </Flex>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
            <Player />
            <Chat />
        </Flex>
    );
}
