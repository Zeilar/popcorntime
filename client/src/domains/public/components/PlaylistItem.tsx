import { Img } from "@chakra-ui/image";
import { Box } from "@chakra-ui/layout";
import Button from "domains/common/components/styles/button";
import { WebsocketContext } from "domains/public/contexts";
import React, { useContext } from "react";
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
    const { getActiveVideo } = useContext(RoomContext);
    const { roomId } = useParams<IRoomParams>();

    const activeVideo = getActiveVideo();
    const active = activeVideo && activeVideo.id === video.id;

    function setActive() {
        publicSocket.emit("room:playlist:select", {
            id: video.id,
            roomId,
        });
    }

    function remove(e: React.MouseEvent) {
        e.stopPropagation();
        publicSocket.emit("room:playlist:remove", {
            videoId: video.id,
            roomId,
        });
    }

    return (
        <Box
            onClick={setActive}
            cursor="pointer"
            pos="relative"
            w="15rem"
            _hover={{
                "> .remove-button": {
                    display: "block",
                },
            }}
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
            <Button.Icon
                className="remove-button"
                zIndex={10}
                pos="absolute"
                right="1rem"
                top="1rem"
                mdi="mdiClose"
                onClick={remove}
                display="none"
            />
            <Box
                pos="absolute"
                top={0}
                left={0}
                w="100%"
                h="100%"
                bgColor="blackAlpha.500"
            />
            <Img
                src={`https://img.youtube.com/vi/${video.videoId}/0.jpg`}
                objectFit="cover"
                h="100%"
            />
        </Box>
    );
}
