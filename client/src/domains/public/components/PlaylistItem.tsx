import { Img } from "@chakra-ui/image";
import { Box } from "@chakra-ui/layout";
import { WebsocketContext } from "domains/common/contexts";
import { useContext } from "react";
import { useParams } from "react-router";
import { IRoomParams } from "../@types/params";
import { IVideo } from "../@types/video";
import { RoomContext } from "../contexts";
import { REMOVE_FROM_PLAYLIST } from "../state/actions/room";

interface IProps {
    video: IVideo;
}

export default function PlaylistItem({ video }: IProps) {
    const { publicSocket } = useContext(WebsocketContext);
    const { dispatchPlaylist, isPLaylistItemActive } = useContext(RoomContext);
    const { roomId } = useParams<IRoomParams>();

    function remove() {
        publicSocket.emit("room:playlist:remove", {
            videoId: video.id,
            roomId,
        });
        dispatchPlaylist({
            type: REMOVE_FROM_PLAYLIST,
            id: video.id,
        });
    }

    return (
        <Box onClick={remove} h="100%">
            <Img
                src={`https://img.youtube.com/vi/${video.videoId}/0.jpg`}
                objectFit="cover"
                h="100%"
            />
        </Box>
    );
}
