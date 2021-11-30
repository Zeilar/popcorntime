import { Input } from "@chakra-ui/input";
import { Flex, Text } from "@chakra-ui/layout";
import { MeContext, WebsocketContext } from "domains/public/contexts";
import { useEffect, useContext, useRef, useState } from "react";
import { toast } from "react-toastify";
import YouTube from "react-youtube";
import { RoomContext } from "../contexts";
import PlayerControls from "./PlayerControls";

export default function Player() {
    const { isLeader, room, changeVideo } = useContext(RoomContext);
    const { publicSocket } = useContext(WebsocketContext);
    const { me } = useContext(MeContext);
    const [videoInput, setVideoInput] = useState("");
    const player = useRef<YouTube>(null);

    const canControl = isLeader(me?.id);

    const internalPlayer: YT.Player | undefined =
        player.current?.getInternalPlayer();

    function submitVideo(e: React.FormEvent) {
        e.preventDefault();
        if (!videoInput) {
            return;
        }
        let url: URL;
        try {
            url = new URL(videoInput);
        } catch (e) {
            toast.error("Invalid URL.");
            return;
        }
        let videoId: string | null;
        if (url.hostname === "youtu.be") {
            const paths = url.pathname.slice(1).split("/");
            videoId = paths[0];
        } else {
            videoId = url.searchParams.get("v");
        }
        if (!videoId) {
            return toast.error("Invalid URL.");
        }
        if (videoId === room?.videoId) {
            return toast.error("That video is already active.");
        }
        setVideoInput("");
        publicSocket.emit("room:video:change", videoId);
    }

    useEffect(() => {
        publicSocket.on("room:video:change", (videoId: string) => {
            changeVideo(videoId);
        });
        return () => {
            publicSocket.off("room:video:change");
        };
    }, [publicSocket, changeVideo]);

    useEffect(() => {
        if (!internalPlayer) {
            return;
        }

        publicSocket.on("video:sync", (timestamp: number) => {
            internalPlayer.seekTo(timestamp, true);
        });
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
                .off("video:sync")
                .off("video:skip:backward")
                .off("video:skip:forward");
        };
    }, [publicSocket, internalPlayer]);

    return (
        <Flex flexDir="column" flexGrow={1} overflowX="auto" bgColor="gray.600">
            {canControl && (
                <Flex
                    as="form"
                    onSubmit={submitVideo}
                    boxShadow="elevate.bottom"
                    h="3rem"
                    zIndex={50}
                >
                    <Input
                        variant="flushed"
                        px="1rem"
                        h="100%"
                        py="0.5rem"
                        value={videoInput}
                        onChange={e => setVideoInput(e.target.value)}
                        placeholder="Change video"
                    />
                </Flex>
            )}
            <Flex
                flexGrow={1}
                sx={{ ".youtube": { flexGrow: 1, height: "100%" } }}
                bgColor="gray.900"
                pos="relative"
                justifyContent="center"
                alignItems="center"
            >
                {!room?.videoId && (
                    <Flex
                        h="100%"
                        color="textMuted"
                        alignItems="center"
                        justifyContent="center"
                        pos="absolute"
                        bgColor="gray.900"
                        w="100%"
                        zIndex={10}
                        top={0}
                        left={0}
                    >
                        <Text
                            as="h1"
                            p="1rem"
                            userSelect="none"
                            textAlign="center"
                        >
                            No video selected
                        </Text>
                    </Flex>
                )}
                <YouTube
                    opts={{ width: "100%", height: "100%" }}
                    ref={player}
                    containerClassName="youtube"
                    videoId={room?.videoId}
                />
            </Flex>
            <PlayerControls player={internalPlayer} />
        </Flex>
    );
}
