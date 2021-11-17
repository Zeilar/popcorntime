import { useContext, useEffect, useRef, useState } from "react";
import { Redirect, useHistory, useParams } from "react-router";
import { ISocket } from "domains/common/@types/socket";
import YouTube from "react-youtube";
import { toast } from "react-toastify";
import { Box, Divider } from "@chakra-ui/layout";
import { Chat } from "../components/chat";
import { v4 as uuidv4, validate } from "uuid";
import { Flex } from "@chakra-ui/react";
import { Color } from "domains/common/@types/color";
import Button from "domains/common/components/styles/button";
import { WebsocketContext } from "domains/common/contexts";
import PageSpinner from "domains/common/components/styles/PageSpinner";
import { AnimatePresence } from "framer-motion";
import Playlist from "../components/Playlist";
import { IErrorPayload } from "domains/common/@types/listener";
import { RoomContext } from "../contexts";
import * as Actions from "../state/actions/room";

interface IParams {
    roomId: string;
}

export function Room() {
    const { roomId } = useParams<IParams>();
    const [playerState, setPlayerState] = useState<YT.PlayerState>(-1);
    const [isConnected, setIsConnected] = useState(false);
    const { publicSocket } = useContext(WebsocketContext);
    const player = useRef<YouTube>(null);
    const { push } = useHistory();
    const { playlist, dispatchPlaylist, sockets, dispatchSockets } =
        useContext(RoomContext);

    const internalPlayer: YT.Player | undefined =
        player.current?.getInternalPlayer();

    function play() {
        if (!internalPlayer) {
            return;
        }
        internalPlayer.playVideo();
        publicSocket.emit("video:play");
    }

    function pause() {
        if (!internalPlayer) {
            return;
        }
        internalPlayer.pauseVideo();
        publicSocket.emit("video:pause");
    }

    async function skipBackward() {
        if (!internalPlayer) {
            return;
        }
        await internalPlayer.getPlayerState<true>();
        internalPlayer.seekTo(
            (await internalPlayer.getCurrentTime<true>()) - 15,
            true
        );
        publicSocket.emit("video:skip:backward");
    }

    async function skipForward() {
        if (!internalPlayer) {
            return;
        }
        internalPlayer.seekTo(
            (await internalPlayer.getCurrentTime<true>()) + 15,
            true
        );
        publicSocket.emit("video:skip:forawrd");
    }

    useEffect(() => {
        publicSocket.emit("room:join", roomId);
        publicSocket.once(
            "room:join",
            (payload: { sockets: ISocket[]; playlist: string[] }) => {
                dispatchSockets({
                    type: Actions.SET_SOCKETS,
                    sockets: payload.sockets,
                });
                dispatchPlaylist({
                    type: Actions.SET_PLAYLIST,
                    playlist: payload.playlist.map(video => ({
                        id: uuidv4(),
                        videoId: video,
                    })),
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
    }, [publicSocket, internalPlayer, dispatchSockets]);

    useEffect(() => {
        if (!internalPlayer) {
            return;
        }

        publicSocket.on("video:play", () => {
            internalPlayer.playVideo();
        });
        publicSocket.on("video:pause", () => {
            internalPlayer.pauseVideo();
        });
        publicSocket.on("video:skip:forward", async () => {
            internalPlayer.seekTo(
                (await internalPlayer.getCurrentTime<true>()) + 15,
                true
            );
        });
        publicSocket.on("video:skip:backward", async () => {
            internalPlayer.seekTo(
                (await internalPlayer.getCurrentTime<true>()) - 15,
                true
            );
        });
        return () => {
            publicSocket
                .off("video:play")
                .off("video:pause")
                .off("video:skip:backward")
                .off("video:skip:forward");
        };
    }, [publicSocket, internalPlayer]);

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

    useEffect(() => {
        if (!internalPlayer) {
            return;
        }
        function onStateChange(e: YT.PlayerEvent) {
            setPlayerState(e.target.getPlayerState());
        }
        internalPlayer.addEventListener("onStateChange", onStateChange);
        return () => {
            internalPlayer.removeEventListener("onStateChange", onStateChange);
        };
    }, [internalPlayer]);

    // TODO: have some button that shows room info (status, room id, sockets etc)

    if (!validate(roomId)) {
        toast.error(
            "Invalid room id. Please click the button to generate one.",
            { toastId: "invalid:room:id" } // For some reason this toast fires twice, prevent this with id
        );
        return <Redirect to="/" />;
    }

    return (
        <Flex w="100%">
            <AnimatePresence>{!isConnected && <PageSpinner />}</AnimatePresence>
            <Flex flexDir="column" flexGrow={1}>
                <Box
                    flexGrow={1}
                    sx={{ ".youtube": { height: "100%" } }}
                    m="1rem"
                >
                    <YouTube
                        opts={{ width: "100%", height: "100%" }}
                        ref={player}
                        containerClassName="youtube"
                        videoId={playlist[0]?.videoId}
                    />
                </Box>
                <Divider />
                <Flex
                    justify="center"
                    align="center"
                    py="1rem"
                    gridGap="0.5rem"
                >
                    <Button.Icon
                        tooltip="Skip backward 15 seconds"
                        mdi="mdiSkipBackward"
                        onClick={skipBackward}
                    />
                    {playerState === 1 ? (
                        <Button.Icon
                            tooltip="Pause"
                            onClick={pause}
                            mdi="mdiPause"
                        />
                    ) : (
                        <Button.Icon
                            tooltip="Play"
                            onClick={play}
                            mdi="mdiPlay"
                        />
                    )}
                    <Button.Icon
                        tooltip="Skip forward 15 seconds"
                        mdi="mdiSkipForward"
                        onClick={skipForward}
                    />
                </Flex>
                <Divider />
                <Playlist roomId={roomId} playlist={playlist} />
            </Flex>
            <Chat roomId={roomId} sockets={sockets} />
        </Flex>
    );
}
