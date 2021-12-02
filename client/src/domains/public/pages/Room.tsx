import { useContext, useEffect, useState } from "react";
import { Redirect, useHistory, useParams } from "react-router";
import { ISocket } from "domains/common/@types/socket";
import { toast } from "react-toastify";
import { Chat } from "../components/chat";
import { validate } from "uuid";
import { Flex } from "@chakra-ui/react";
import { Color } from "domains/common/@types/color";
import { MeContext, WebsocketContext } from "domains/public/contexts";
import { IErrorPayload } from "domains/common/@types/listener";
import { RoomContext } from "../contexts";
import * as Actions from "../state/actions/room";
import Player from "../components/Player";
import { IRoomParams } from "../@types/params";
import { IRoom } from "domains/common/@types/room";
import Modal from "domains/common/components/styles/modal";
import { useDisclosure } from "@chakra-ui/hooks";
import { Input } from "@chakra-ui/input";
import Button from "domains/common/components/styles/button";

export function Room() {
    const { roomId } = useParams<IRoomParams>();
    const { publicSocket } = useContext(WebsocketContext);
    const { push } = useHistory();
    const { dispatchSockets, setRoom, setLeader } = useContext(RoomContext);
    const { me } = useContext(MeContext);
    const [authorized, setAuthorized] = useState<boolean | null>(null);
    const passwordPrompt = useDisclosure();
    const [password, setPassword] = useState("");

    function authorize(e: React.FormEvent) {
        e.preventDefault();
        publicSocket.emit("room:join", { roomId, password });
    }

    useEffect(() => {
        publicSocket.on("room:join", (payload: IRoom) => {
            dispatchSockets({
                type: Actions.SET_SOCKETS,
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
            setAuthorized(true);
            passwordPrompt.onClose();
        });
        return () => {
            publicSocket.off("room:join");
        };
    }, [publicSocket, dispatchSockets, setRoom, passwordPrompt]);

    useEffect(() => {
        publicSocket.on("room:socket:join", (socket: ISocket) => {
            dispatchSockets({
                type: Actions.ADD_SOCKET,
                socket,
            });
        });
        publicSocket.on("room:socket:leave", (socket: ISocket) => {
            dispatchSockets({
                type: Actions.REMOVE_SOCKET,
                socketId: socket.id,
            });
        });
        publicSocket.on(
            "room:socket:update:color",
            (payload: { color: Color; socketId: string }) => {
                dispatchSockets({
                    type: Actions.EDIT_SOCKET_COLOR,
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
            toast.error(`${payload.message} ${payload.reason}`);
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
            if (me?.id === leader) {
                toast.info("You are now the room leader.");
            }
            setLeader(leader);
        });
        return () => {
            publicSocket.off("room:leader:new");
        };
    }, [publicSocket, setRoom, me?.id, setLeader]);

    useEffect(() => {
        return () => {
            setRoom({} as any);
            setAuthorized(false);
            setPassword("");
        };
    }, [roomId, setRoom]);

    useEffect(() => {
        publicSocket.on("socket:kick", () => {
            toast.info("You were kicked from the server.");
        });
        return () => {
            publicSocket.off("socket:kick");
        };
    }, [publicSocket]);

    useEffect(() => {
        if (publicSocket.connected) {
            publicSocket.emit("room:join", { roomId });
        }
        publicSocket.on("room:error:password", (payload: IErrorPayload) => {
            toast.error(`${payload.message}\n${payload.reason}`);
        });
        publicSocket.on("room:unauthorized", () => {
            setAuthorized(false);
        });
        publicSocket.on("connect", () => {
            publicSocket.emit("room:join", { roomId });
        });
        return () => {
            publicSocket
                .emit("room:leave", roomId)
                .off("room:error:password")
                .off("room:unauthorized");
        };
    }, [publicSocket, roomId]);

    if (!validate(roomId)) {
        toast.error(
            "Invalid room id. Please click the button to generate one.",
            { toastId: "invalid:room:id" } // For some reason this toast fires twice, prevent this with id
        );
        return <Redirect to="/" />;
    }

    return (
        <Flex flexGrow={1} maxH="100%" overflow="hidden">
            <Modal
                onClose={passwordPrompt.onClose}
                isOpen={authorized === false}
            >
                <Modal.Content>
                    <Modal.Body>
                        <Modal.Header as="h3">
                            Please enter the password
                        </Modal.Header>
                        <Flex as="form" onSubmit={authorize}>
                            <Input
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                type="password"
                                autoFocus
                            />
                            <Button ml="0.5rem" variant="primary" type="submit">
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
