import { Input } from "@chakra-ui/input";
import { Flex, Text } from "@chakra-ui/layout";
import env from "config/env";
import Button from "domains/common/components/styles/button";
import { WebsocketContext } from "domains/public/contexts";
import { useLocalStorage } from "domains/common/hooks";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { IRoomParams } from "../@types/params";
import { IVideo } from "../@types/video";
import { RoomContext } from "../contexts";
import {
    ADD_TO_PLAYLIST,
    PLAYLIST_ACTIVE_SET,
    REMOVE_FROM_PLAYLIST,
} from "../state/actions/room";
import PlaylistItem from "./PlaylistItem";

export default function Playlist() {
    const { publicSocket } = useContext(WebsocketContext);
    const { roomId } = useParams<IRoomParams>();
    const { dispatchPlaylist, playlist } = useContext(RoomContext);
    const [input, setInput] = useState("");
    const [showPlaylist, setShowPlaylist] = useLocalStorage(
        "showPLaylist:chat",
        true
    );

    function togglePlaylist() {
        setShowPlaylist(p => !p);
    }

    useEffect(() => {
        publicSocket.on("room:playlist:select", (id: string) => {
            dispatchPlaylist({
                type: PLAYLIST_ACTIVE_SET,
                id,
            });
        });
        publicSocket.on("room:playlist:add", (video: IVideo) => {
            dispatchPlaylist({
                type: ADD_TO_PLAYLIST,
                video,
            });
        });
        publicSocket.on("room:playlist:remove", (id: string) => {
            dispatchPlaylist({
                type: REMOVE_FROM_PLAYLIST,
                id,
            });
        });
        return () => {
            publicSocket
                .off("room:playlist:add")
                .off("room:playlist:remove")
                .off("room:playlist:select");
        };
    }, [publicSocket, dispatchPlaylist, playlist]);

    function add(e: React.FormEvent) {
        e.preventDefault();
        if (!input) {
            return;
        }
        if (playlist.length >= env.ROOM_MAX_PLAYLIST) {
            return toast.error("Playlist is full.");
        }
        let url: URL;
        try {
            url = new URL(input);
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
        setInput("");
        publicSocket.emit("room:playlist:add", {
            roomId,
            video: {
                id: uuidv4(),
                videoId,
            },
        });
    }

    return (
        <Flex
            flexDir="column"
            h="100%"
            w={showPlaylist ? "auto" : "3rem"}
            zIndex={100}
        >
            <Flex
                p="0.5rem"
                alignItems="center"
                justifyContent="space-between"
                boxShadow="elevate.bottom"
            >
                {showPlaylist && (
                    <>
                        <Button.Icon />
                        <Text fontWeight={600}>Playlist</Text>
                    </>
                )}
                {showPlaylist ? (
                    <Button.Icon
                        onClick={togglePlaylist}
                        tooltip="Hide playlist"
                        mdi="mdiArrowCollapseLeft"
                    />
                ) : (
                    <Button.Icon
                        onClick={togglePlaylist}
                        tooltip="Show playlist"
                        mdi="mdiArrowExpandRight"
                    />
                )}
            </Flex>
            {showPlaylist && (
                <>
                    <Flex
                        flexDir="column"
                        px="0.5rem"
                        py="1rem"
                        as="form"
                        onSubmit={add}
                        boxShadow="elevate.bottom"
                    >
                        <Flex justifyContent="space-between">
                            <Text color="textMuted" mb="0.5rem">
                                Add video
                            </Text>
                            <Text
                                fontWeight={600}
                                color={
                                    playlist.length >= env.ROOM_MAX_PLAYLIST
                                        ? "danger"
                                        : "textMuted"
                                }
                            >
                                {`${playlist.length} / ${env.ROOM_MAX_PLAYLIST}`}
                            </Text>
                        </Flex>
                        <Input
                            placeholder="Video URL"
                            w="100%"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            bgColor="gray.400"
                            border="none"
                            _focus={{
                                bgColor: "gray.100",
                                boxShadow: "outline",
                            }}
                        />
                    </Flex>
                    <Flex
                        overflowX="hidden"
                        overflowY="auto"
                        flexDir="column"
                        flexGrow={1}
                    >
                        {playlist.map((video, i) => (
                            <PlaylistItem
                                video={video}
                                key={`${video.videoId}-${i}`}
                            />
                        ))}
                    </Flex>
                </>
            )}
        </Flex>
    );
}
