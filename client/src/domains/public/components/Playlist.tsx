import { Input } from "@chakra-ui/input";
import { Box, Divider, Flex } from "@chakra-ui/layout";
import { WebsocketContext } from "domains/common/contexts";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { IVideo } from "../@types/video";
import { RoomContext } from "../contexts";
import { ADD_TO_PLAYLIST, REMOVE_FROM_PLAYLIST } from "../state/actions/room";
import PlaylistItem from "./PlaylistItem";

interface IProps {
    roomId: string;
    playlist: IVideo[];
}

export default function Playlist({ roomId, playlist }: IProps) {
    const { publicSocket } = useContext(WebsocketContext);
    const { dispatchPlaylist } = useContext(RoomContext);
    const [input, setInput] = useState("");

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

    return (
        <Flex
            flexDir="column"
            h="100%"
            borderRight="1px solid"
            borderColor="inherit"
            w="15rem"
        >
            <Flex p="0.5rem" flexDir="column">
                <Box as="form" onSubmit={add}>
                    <Input
                        placeholder="Video URL"
                        w="100%"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                    />
                </Box>
            </Flex>
            <Divider />
            <Flex overflowY="auto" flexDir="column">
                {playlist.map((video, i) => (
                    <PlaylistItem video={video} key={`${video.videoId}-${i}`} />
                ))}
            </Flex>
        </Flex>
    );
}
