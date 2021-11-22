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
import { IVideo } from "../@types/video";
import BrandLogo from "domains/common/components/styles/BrandLogo";
import { Link } from "react-router-dom";
import Player from "../components/Player";
import { IRoomParams } from "../@types/params";
import Navbar from "../components/Navbar";

export function Room() {
    const { roomId } = useParams<IRoomParams>();
    const [isConnected, setIsConnected] = useState(false);
    const { publicSocket } = useContext(WebsocketContext);
    const { push } = useHistory();
    const { playlist, dispatchPlaylist, sockets, dispatchSockets } =
        useContext(RoomContext);

    useEffect(() => {
        publicSocket.emit("room:join", roomId);
        publicSocket.once(
            "room:join",
            (payload: { sockets: ISocket[]; playlist: IVideo[] }) => {
                dispatchSockets({
                    type: Actions.SET_SOCKETS,
                    sockets: payload.sockets,
                });
                dispatchPlaylist({
                    type: Actions.SET_PLAYLIST,
                    playlist: payload.playlist,
                });
                setIsConnected(true);
            }
        );
        return () => {
            publicSocket.off("room:join");
        };
    }, [publicSocket, roomId, dispatchPlaylist, dispatchSockets]);

    useEffect(() => {
        publicSocket.on("room:socket:join", (socket: ISocket) => {
            dispatchSockets({
                type: Actions.ADD_SOCKET,
                socketId: socket.id,
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
        return () => {
            publicSocket.emit("room:leave");
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
                <Playlist roomId={roomId} playlist={playlist} />
                <Player />
                <Chat roomId={roomId} sockets={sockets} />
            </Flex>
        </Flex>
    );
}
