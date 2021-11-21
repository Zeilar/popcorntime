import { Input } from "@chakra-ui/input";
import { Flex, Text } from "@chakra-ui/layout";
import Button from "domains/common/components/styles/button";
import { WebsocketContext } from "domains/common/contexts";
import { useLocalStorage } from "domains/common/hooks";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { IVideo } from "../@types/video";
import { RoomContext } from "../contexts";
import {
    ADD_TO_PLAYLIST,
    PLAYLIST_ACTIVE_PREVIOUS,
    REMOVE_FROM_PLAYLIST,
} from "../state/actions/room";
import PlaylistItem from "./PlaylistItem";

interface IProps {
    roomId: string;
    playlist: IVideo[];
}

export default function Playlist({ roomId, playlist }: IProps) {
    const { publicSocket } = useContext(WebsocketContext);
    const { dispatchPlaylist, activeVideo, dispatchActiveVideo } =
        useContext(RoomContext);
    const [input, setInput] = useState("");
    const [showPlaylist, setShowPlaylist] = useLocalStorage(
        "showPLaylist:chat",
        true
    );

    function togglePlaylist() {
        setShowPlaylist(p => !p);
    }

    useEffect(() => {
        publicSocket.on("room:playlist:add", (video: IVideo) => {
            dispatchPlaylist({
                type: ADD_TO_PLAYLIST,
                video,
            });
        });
        publicSocket.on("room:playlist:remove", (videoId: string) => {
            dispatchPlaylist({
                type: REMOVE_FROM_PLAYLIST,
                id: videoId,
            });
        });
        return () => {
            publicSocket.off("room:playlist:add").off("room:playlist:remove");
        };
    }, [publicSocket, dispatchPlaylist]);

    function add(e: React.FormEvent) {
        e.preventDefault();
        if (
            playlist.length >= parseInt(process.env.REACT_APP_ROOM_MAX_PLAYLIST)
        ) {
            return toast.error("Playlist is full.");
        }
        if (!input) {
            return;
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
            toast.error("Invalid URL.");
            return;
        }
        const video = {
            id: uuidv4(),
            videoId,
        };
        setInput("");
        dispatchPlaylist({
            type: ADD_TO_PLAYLIST,
            video,
        });
        publicSocket.emit("room:playlist:add", { roomId, video });
    }

    useEffect(() => {
        // If an item was active and removed, try to make the previous one active instead.
        if (activeVideo !== 0 && !playlist[activeVideo]) {
            console.log("go previous");
            dispatchActiveVideo({
                type: PLAYLIST_ACTIVE_PREVIOUS,
            });
        }
    }, [playlist, activeVideo, dispatchActiveVideo]);

    return (
        <Flex
            flexDir="column"
            h="100%"
            w={showPlaylist ? "15rem" : "3rem"}
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
                        <Text>Playlist</Text>
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
                        <Text color="textMuted" mb="0.5rem">
                            Add video
                        </Text>
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
                    <Flex overflowY="auto" flexDir="column">
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
