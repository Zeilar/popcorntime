import { Flex, Text } from "@chakra-ui/layout";
import { WebsocketContext } from "domains/public/contexts";
import { useEffect, useContext, useRef } from "react";
import YouTube from "react-youtube";
import { RoomContext } from "../contexts";
import PlayerControls from "./PlayerControls";

export default function Player() {
    const { playlist, activeVideo, getActiveVideo } = useContext(RoomContext);
    const { publicSocket } = useContext(WebsocketContext);
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
                pos="relative"
                justifyContent="center"
                alignItems="center"
            >
                {!getActiveVideo() && (
                    <Flex
                        h="100%"
                        color="textMuted"
                        alignItems="center"
                        justifyContent="center"
                        pos="absolute"
                        bgColor="gray.900"
                        w="100%"
                        zIndex={100}
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
                    videoId={playlist[activeVideo]?.videoId}
                />
            </Flex>
            <PlayerControls player={internalPlayer} />
        </Flex>
    );
}
