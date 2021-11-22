import { Flex, Text } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import Button from "domains/common/components/styles/button";
import { WebsocketContext } from "domains/common/contexts";
import { useState, useEffect, useContext, useRef } from "react";
import YouTube from "react-youtube";
import { RoomContext } from "../contexts";

export default function Player() {
    const { playlist, activeVideo } = useContext(RoomContext);
    const { publicSocket } = useContext(WebsocketContext);
    const [playerState, setPlayerState] = useState<YT.PlayerState>(-1);
    const player = useRef<YouTube>(null);

    const internalPlayer: YT.Player | undefined =
        player.current?.getInternalPlayer();

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

    async function sync() {
        if (!internalPlayer) {
            return;
        }
        publicSocket.emit(
            "video:sync",
            await internalPlayer.getCurrentTime<true>()
        );
    }

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
        publicSocket.emit("video:skip:forward");
    }

    return (
        <Flex
            flexDir="column"
            flexGrow={1}
            overflowX="auto"
            boxShadow="elevate.all"
            zIndex={20}
        >
            <Flex
                flexGrow={1}
                sx={{ ".youtube": { flexGrow: 1, height: "100%" } }}
                boxShadow="elevate.bottom"
                bgColor="gray.900"
                justifyContent="center"
                alignItems="center"
            >
                {player ? (
                    playlist[activeVideo] ? (
                        <YouTube
                            opts={{ width: "100%", height: "100%" }}
                            ref={player}
                            containerClassName="youtube"
                            videoId={
                                playlist[activeVideo]?.videoId ?? "dQw4w9WgXcQ"
                            }
                        />
                    ) : (
                        <Flex
                            h="100%"
                            color="textMuted"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Text as="h1" p="1rem">
                                No video selected
                            </Text>
                        </Flex>
                    )
                ) : (
                    <Spinner color="brand.default" size="xl" />
                )}
            </Flex>
            <Flex justify="center" align="center" py="1rem" gridGap="0.5rem">
                <Button.Icon
                    tooltip="Skip backward 15 seconds"
                    mdi="mdiSkipBackward"
                    onClick={skipBackward}
                />
                <Button.Icon
                    mdi="mdiSync"
                    tooltip="Sync with room"
                    onClick={sync}
                />
                {playerState === 1 ? (
                    <Button.Icon
                        tooltip="Pause"
                        onClick={pause}
                        mdi="mdiPause"
                    />
                ) : (
                    <Button.Icon tooltip="Play" onClick={play} mdi="mdiPlay" />
                )}
                <Button.Icon
                    tooltip="Skip forward 15 seconds"
                    mdi="mdiSkipForward"
                    onClick={skipForward}
                />
            </Flex>
        </Flex>
    );
}
