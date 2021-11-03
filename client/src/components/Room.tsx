import { useEffect, useRef, useState } from "react";
import { Redirect, useHistory, useParams } from "react-router";
import { ISocket } from "../../@types/socket";
import { socket } from "./App";
import YouTube from "react-youtube";
import { toast } from "react-toastify";
import { Box, Grid } from "@chakra-ui/layout";
import { Chat } from "./chat";
import { validate } from "uuid";
import { Flex } from "@chakra-ui/react";
import Button from "./styles/button";
import { Color } from "../../@types/color";

interface IParams {
    roomId: string;
}

export default function Room() {
    const { roomId } = useParams<IParams>();
    const [sockets, setSockets] = useState<ISocket[]>([]);
    const [playlist, setPlaylist] = useState<string[]>([]);
    const [playlistInput, setPlaylistInput] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const player = useRef<YouTube>(null);
    const { push } = useHistory();

    function play() {
        socket.emit("video:play");
    }

    useEffect(() => {
        if (!validate(roomId)) {
            // No need to toast here, the redirect further down takes care of that, this is just to stop unnecessary code from running
            return;
        }

        const internalPlayer: YT.Player | undefined =
            player.current?.getInternalPlayer();

        socket.emit("room:join", roomId);
        socket.once(
            "room:join",
            (payload: { sockets: ISocket[]; playlist: string[] }) => {
                toast.success("Joined room.");
                setSockets(payload.sockets);
                setPlaylist(payload.playlist);
                setIsConnected(true);
            }
        );
        socket.on("room:socket:join", (socket: ISocket) => {
            setSockets((sockets) => [...sockets, socket]);
            toast.info(`${socket.username} joined.`);
        });
        socket.on("room:socket:leave", (socket: ISocket) => {
            setSockets((sockets) =>
                sockets.filter((element) => element.id !== socket.id)
            );
            toast.info(`${socket.username} left.`);
        });
        socket.on(
            "room:socket:update:color",
            (payload: { color: Color; socketId: string }) => {
                setSockets((sockets) =>
                    sockets.map((socket) => {
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
        socket.on("room:kick", (message: string) => {
            toast.info(message);
            push("/");
        });
        socket.on("video:play", () => {
            internalPlayer?.playVideo();
        });

        // Just to be safe
        return () => {
            socket.emit("room:leave", roomId);
            socket
                .off("room:join")
                .off("room:socket:leave")
                .off("room:socket:join")
                .off("video:play");
            setSockets([]);
            setPlaylist([]);
            setPlaylistInput("");
        };
    }, [roomId]);

    useEffect(() => {
        return () => {
            if (isConnected) {
                toast.info("Left room.");
            }
        };
    }, [isConnected]);

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
        <Grid w="100%" gridTemplateColumns="75% 25%">
            <Flex flexDir="column">
                <Box flexGrow={1} sx={{ ".youtube": { height: "100%" } }}>
                    <YouTube
                        opts={{ width: "100%", height: "100%" }}
                        ref={player}
                        containerClassName="youtube"
                        videoId={playlist[0]}
                    />
                </Box>
                <Box bgColor="whiteAlpha.100">
                    <Button.Icon onClick={play}>Play</Button.Icon>
                </Box>
            </Flex>
            <Chat roomId={roomId} sockets={sockets} />
        </Grid>
    );
}
