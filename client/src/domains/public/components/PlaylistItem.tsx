import { Img } from "@chakra-ui/image";
import { Box } from "@chakra-ui/layout";
import { WebsocketContext } from "domains/common/contexts";
import { useContext } from "react";
import { useParams } from "react-router";
import { IRoomParams } from "../@types/params";
import { IVideo } from "../@types/video";
import { RoomContext } from "../contexts";
import {
    PLAYLIST_ACTIVE_SET,
    REMOVE_FROM_PLAYLIST,
} from "../state/actions/room";

interface IProps {
    video: IVideo;
}

export default function PlaylistItem({ video }: IProps) {
    const { publicSocket } = useContext(WebsocketContext);
    const {
        dispatchPlaylist,
        dispatchActiveVideo,
        isPLaylistItemActive,
        getIndexOfPlaylistItem,
    } = useContext(RoomContext);
    const { roomId } = useParams<IRoomParams>();

    const active = isPLaylistItemActive(video.id);

    function setActive() {
        console.log("set active", getIndexOfPlaylistItem(video.id));
        publicSocket.emit("room:playlist:select", {
            video,
            roomId,
        });
        dispatchActiveVideo({
            type: PLAYLIST_ACTIVE_SET,
            index: getIndexOfPlaylistItem(video.id),
        });
    }

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
        <Box
            onClick={setActive}
            h="100%"
            pos="relative"
            _after={
                active
                    ? {
                          content: `""`,
                          pos: "absolute",
                          top: 0,
                          left: 0,
                          w: "100%",
                          h: "100%",
                          border: "2px solid",
                          borderColor: "brand.default",
                      }
                    : undefined
            }
        >
            <Img
                src={`https://img.youtube.com/vi/${video.videoId}/0.jpg`}
                objectFit="cover"
                h="100%"
            />
        </Box>
    );
}
