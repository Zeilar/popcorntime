import { Img } from "@chakra-ui/image";
import { Input } from "@chakra-ui/input";
import { Box, Divider, Flex, Text } from "@chakra-ui/layout";
import { WebsocketContext } from "domains/common/contexts";
import { useContext, useState } from "react";
import { toast } from "react-toastify";

interface IProps {
    roomId: string;
    playlist: string[];
}

export default function Playlist({ roomId, playlist }: IProps) {
    const { publicSocket } = useContext(WebsocketContext);
    const [input, setInput] = useState("");

    function add(e: React.FormEvent) {
        e.preventDefault();
        const url = new URL(input);
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
            <Flex gridGap="0.5rem" p="0.5rem" overflowX="auto">
                {playlist.map(video => (
                    <Box w="10rem">
                        <Img
                            src={`https://img.youtube.com/vi/${video}/0.jpg`}
                        />
                    </Box>
                ))}
            </Flex>
        </Flex>
    );
}
