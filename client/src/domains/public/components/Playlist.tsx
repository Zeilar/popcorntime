import { Img } from "@chakra-ui/image";
import { Input } from "@chakra-ui/input";
import { Box, Divider, Flex } from "@chakra-ui/layout";
import { WebsocketContext } from "domains/common/contexts";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { IVideo } from "../@types/video";
import { RoomContext } from "../contexts";
import { ADD_TO_PLAYLIST } from "../state/actions/room";

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
            console.log("got video", video);
        });
        return () => {
            publicSocket.off("room:playlist:add");
        };
    }, [publicSocket]);

    function add(e: React.FormEvent) {
        e.preventDefault();
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
        setInput("");
        dispatchPlaylist({
            type: ADD_TO_PLAYLIST,
            video: {
                id: uuidv4(),
                videoId,
            },
        });
        publicSocket.emit("room:playlist:add", { roomId, videoId });
    }

    return (
        <Flex flexDir="column">
            <Flex p="0.5rem" flexDir="column">
                <Box as="form" onSubmit={add}>
                    <Input
                        placeholder="Video URL"
                        w="35rem"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                    />
                </Box>
            </Flex>
            <Divider />
            <Flex gridGap="0.5rem" p="0.5rem" overflowX="auto">
                {playlist.map((video, i) => (
                    <Box w="10rem" key={`${video.videoId}-${i}`}>
                        <Img
                            src={`https://img.youtube.com/vi/${video.videoId}/0.jpg`}
                        />
                    </Box>
                ))}
            </Flex>
        </Flex>
    );
}
