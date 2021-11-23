import { Flex, Text } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import { WebsocketContext } from "domains/common/contexts";
import { useEffect, useContext, useRef } from "react";
import YouTube from "react-youtube";
import { RoomContext } from "../contexts";
import PlayerControls from "./PlayerControls";

export default function Player() {
    const { playlist, activeVideo } = useContext(RoomContext);
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
            <PlayerControls player={internalPlayer} />
        </Flex>
    );
}
