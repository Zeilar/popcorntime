import { useContext, useEffect, useRef, useState } from "react";
import { Redirect, useHistory, useParams } from "react-router";
import { ISocket } from "domains/common/@types/socket";
import YouTube from "react-youtube";
import { toast } from "react-toastify";
import { Box } from "@chakra-ui/layout";
import { Chat } from "../components/chat";
import { validate } from "uuid";
import { Flex } from "@chakra-ui/react";
import { Color } from "domains/common/@types/color";
import Button from "domains/common/components/styles/button";
import { WebsocketContext } from "domains/common/contexts";
import PageSpinner from "domains/common/components/styles/PageSpinner";
import { AnimatePresence } from "framer-motion";

interface IParams {
    roomId: string;
}

export function Room() {
    const { roomId } = useParams<IParams>();
    const [sockets, setSockets] = useState<ISocket[]>([]);
    const [playlist, setPlaylist] = useState<string[]>([]);
    const [playlistInput, setPlaylistInput] = useState("");
    const [playerState, setPlayerState] = useState<YT.PlayerState>(-1);
    const [isConnected, setIsConnected] = useState(false);
    const { publicSocket } = useContext(WebsocketContext);
    const player = useRef<YouTube>(null);
    const { push } = useHistory();

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
                setSockets(payload.sockets);
                setPlaylist(payload.playlist);
                setIsConnected(true);
            }
        );
        return () => {
            publicSocket.off("room:join");
        };
    }, [publicSocket, roomId]);

    useEffect(() => {
        publicSocket.on("room:socket:join", (socket: ISocket) => {
            setSockets(sockets => [...sockets, socket]);
        });
        publicSocket.on("room:socket:leave", (socket: ISocket) => {
            setSockets(sockets =>
                sockets.filter(element => element.id !== socket.id)
            );
        });
        publicSocket.on(
            "room:socket:update:color",
            (payload: { color: Color; socketId: string }) => {
                setSockets(sockets =>
                    sockets.map(socket => {
                        if (socket.id !== payload.socketId) {
                            return socket;
                        }
                        return {
                            ...socket,
                            color: payload.color,
                        };
                    })
                );
            }
        );

        return () => {
            publicSocket
                .off("room:socket:join")
                .off("room:socket:leave")
                .off("room:socket:update:color");
        };
    }, [publicSocket, internalPlayer]);

    useEffect(() => {
        if (!internalPlayer) {
            return;
        }

        publicSocket.on("video:play", async () => {
            internalPlayer.playVideo();
        });
        publicSocket.on("video:pause", async () => {
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
        publicSocket.once("room:connection:error", (message: string) => {
            toast.error(message);
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
        <Flex w="100%" bgColor="gray.900">
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
                        videoId={playlist[0]}
                    />
                </Box>
                <Flex justify="center" align="center">
                    <Button.Icon
                        tooltip="Skip backward 15 seconds"
                        icon="mdiSkipBackward"
                        onClick={skipBackward}
                    />
                    {playerState === 1 ? (
                        <Button.Icon
                            tooltip="Pause"
                            onClick={pause}
                            icon="mdiPause"
                        />
                    ) : (
                        <Button.Icon
                            tooltip="Play"
                            onClick={play}
                            icon="mdiPlay"
                        />
                    )}
                    <Button.Icon
                        tooltip="Skip forward 15 seconds"
                        icon="mdiSkipForward"
                        onClick={skipForward}
                    />
                </Flex>
            </Flex>
            <Chat roomId={roomId} sockets={sockets} />
        </Flex>
    );
}
