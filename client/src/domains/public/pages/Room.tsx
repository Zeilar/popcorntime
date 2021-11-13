import { useContext, useEffect, useRef, useState } from "react";
import { Redirect, useHistory, useParams } from "react-router";
import { ISocket } from "domains/common/@types/socket";
import YouTube from "react-youtube";
import { toast } from "react-toastify";
import { Box, Grid } from "@chakra-ui/layout";
import { Chat } from "../components/chat";
import { validate } from "uuid";
import { Flex } from "@chakra-ui/react";
import { Color } from "domains/common/@types/color";
import Button from "domains/common/components/styles/button";
import { WebsocketContext } from "domains/common/contexts";

interface IParams {
    roomId: string;
}

export function Room() {
    const { roomId } = useParams<IParams>();
    const [sockets, setSockets] = useState<ISocket[]>([]);
    const [playlist, setPlaylist] = useState<string[]>([]);
    const [playlistInput, setPlaylistInput] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const { publicSocket } = useContext(WebsocketContext);
    const player = useRef<YouTube>(null);
    const { push } = useHistory();

    function play() {
        publicSocket.emit("video:play");
    }

    function pause() {
        publicSocket.emit("video:pause");
    }

    useEffect(() => {
        if (!validate(roomId)) {
            // No need to toast here, the redirect further down takes care of that, this is just to stop unnecessary code from running
            return;
        }

        const internalPlayer: YT.Player | undefined =
            player.current?.getInternalPlayer();

        publicSocket.emit("room:join", roomId);
        publicSocket.once(
            "room:join",
            (payload: { sockets: ISocket[]; playlist: string[] }) => {
                setSockets(payload.sockets);
                setPlaylist(payload.playlist);
                setIsConnected(true);
                toast.success("Joined room.");
            }
        );
        publicSocket.on("room:socket:join", (socket: ISocket) => {
            setSockets(sockets => [...sockets, socket]);
        });
        publicSocket.on("room:socket:leave", (socket: ISocket) => {
            setSockets(sockets =>
                sockets.filter(element => element.id !== socket.id)
            );
        });
        publicSocket.on("room:kick", () => {
            toast.info("You were kicked from the room.");
            push("/");
        });
        publicSocket.on("room:destroy", () => {
            toast.info("The room was deleted.");
            push("/");
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
        publicSocket.on("video:play", () => {
            internalPlayer?.playVideo();
        });

        // Just to be safe, roomId should in theory never change but you never know
        return () => {
            publicSocket
                .off("room:join")
                .off("room:socket:leave")
                .off("room:socket:join")
                .off("video:play")
                .off("room:kick")
                .off("room:destroy");
            setSockets([]);
            setPlaylist([]);
            setPlaylistInput("");
        };
    }, [roomId, push, publicSocket]);

    // TODO: socket.emit("room:leave", roomId); when you press leave, not in unmount, to prevent "undefined" left bug

    // TODO: use "light" prop for playlist thumbnails

    // TODO: have some button that shows room info (status, room id, sockets etc)

    if (!validate(roomId)) {
        toast.error(
            "Invalid room id. Please click the button to generate one.",
            { toastId: "invalid:room:id" } // For some reason this toast fires twice, prevent this with id
        );
        return <Redirect to="/" />;
    }

    return (
        <Grid
            w="100%"
            gridTemplateColumns="75% 1fr"
            bgColor="gray.900"
            gridGap="1rem"
        >
            <Flex flexDir="column">
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
                    <Button.Icon onClick={play} icon="mdiPlay" />
                    <Button.Icon onClick={pause} icon="mdiPause" />
                </Flex>
            </Flex>
            <Chat roomId={roomId} sockets={sockets} />
        </Grid>
    );
}
