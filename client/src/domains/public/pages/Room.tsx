import { useContext, useEffect, useState } from "react";
import { Redirect, useHistory, useParams } from "react-router";
import { ISocket } from "domains/common/@types/socket";
import { toast } from "react-toastify";
import { Chat } from "../components/chat";
import { validate } from "uuid";
import { Flex } from "@chakra-ui/react";
import { Color } from "domains/common/@types/color";
import { WebsocketContext } from "domains/common/contexts";
import PageSpinner from "domains/common/components/styles/PageSpinner";
import { AnimatePresence } from "framer-motion";
import Playlist from "../components/Playlist";
import { IErrorPayload } from "domains/common/@types/listener";
import { RoomContext } from "../contexts";
import * as Actions from "../state/actions/room";
import Player from "../components/Player";
import { IRoomParams } from "../@types/params";
import Navbar from "../components/Navbar";
import { IRoom } from "domains/common/@types/room";

export function Room() {
    const { roomId } = useParams<IRoomParams>();
    const [isConnected, setIsConnected] = useState(false);
    const { publicSocket } = useContext(WebsocketContext);
    const { push } = useHistory();
    const { dispatchPlaylist, dispatchSockets, setRoom } =
        useContext(RoomContext);

    useEffect(() => {
        publicSocket.emit("room:join", roomId);
        publicSocket.once("room:join", (payload: IRoom) => {
            dispatchSockets({
                type: Actions.SET_SOCKETS,
                sockets: payload.sockets,
            });
            dispatchPlaylist({
                type: Actions.SET_PLAYLIST,
                playlist: payload.playlist,
            });
            setRoom({
                id: payload.id,
                name: payload.name,
                created_at: payload.created_at,
                leader: payload.leader,
            });
            setIsConnected(true);
        });
        return () => {
            publicSocket.off("room:join");
        };
    }, [publicSocket, roomId, dispatchPlaylist, dispatchSockets, setRoom]);

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
        publicSocket.once("room:destroy", () => {
            toast.info("The room has been shut down.");
            push("/");
        });
        publicSocket.once("room:connection:error", (payload: IErrorPayload) => {
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
            setRoom(p => ({ ...p, leader }));
        });
        return () => {
            publicSocket.off("room:leader:new");
        };
    }, [publicSocket, setRoom]);

    useEffect(() => {
        publicSocket.once("socket:kick", () => {
            toast.info("You were kicked from the server.");
        });
        return () => {
            publicSocket
                .emit("room:leave")
                .off("room:leader:new")
                .off("socket:kick");
        };
    }, [publicSocket]);

    // TODO: have some button that shows room info (status, room id, sockets etc)

    if (!validate(roomId)) {
        toast.error(
            "Invalid room id. Please click the button to generate one.",
            { toastId: "invalid:room:id" } // For some reason this toast fires twice, prevent this with id
        );
        return <Redirect to="/" />;
    }

    return (
        <Flex flexDir="column" w="100%">
            <Navbar />
            <Flex flexGrow={1} maxH="100%" overflow="hidden">
                <AnimatePresence>
                    {!isConnected && <PageSpinner />}
                </AnimatePresence>
                <Playlist />
                <Player />
                <Chat />
            </Flex>
        </Flex>
    );
}
