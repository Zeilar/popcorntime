import { Img } from "@chakra-ui/image";
import { Box } from "@chakra-ui/layout";
import { WebsocketContext } from "domains/common/contexts";
import { useContext } from "react";
import { IVideo } from "../@types/video";

interface IProps {
    video: IVideo;
}

export default function PlaylistItem({ video }: IProps) {
    const { publicSocket } = useContext(WebsocketContext);

    function remove() {
        publicSocket.emit("room:playlist:remove", video);
    }

    return (
        <Box w="10rem" onClick={remove}>
            <Img
                src={`https://img.youtube.com/vi/${video.videoId}/0.jpg`}
                h="100%"
                objectFit="cover"
            />
        </Box>
    );
}
