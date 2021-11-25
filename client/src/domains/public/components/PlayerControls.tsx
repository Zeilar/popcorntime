import { Flex } from "@chakra-ui/layout";
import Button from "domains/common/components/styles/button";
import { WebsocketContext } from "domains/common/contexts";
import { useState, useContext, useEffect } from "react";
import { useParams } from "react-router";
import { IRoomParams } from "../@types/params";
import { MeContext, RoomContext } from "../contexts";

interface IProps {
    player: YT.Player | undefined;
}

export default function PlayerControls({ player }: IProps) {
    const [playerState, setPlayerState] = useState(-1);
    const { isLeader, dispatchPlaylist, getActiveVideo } =
        useContext(RoomContext);
    const { me } = useContext(MeContext);
    const { publicSocket } = useContext(WebsocketContext);
    const { roomId } = useParams<IRoomParams>();

    const isRoomLeader = isLeader(me?.id);

    async function sync() {
        if (!player || !isRoomLeader) {
            return;
        }
        publicSocket.emit("video:sync", await player.getCurrentTime<true>());
    }

    function play() {
        if (!player || !isRoomLeader) {
            return;
        }
        player.playVideo();
        publicSocket.emit("video:play");
    }

    function pause() {
        if (!player || !isRoomLeader) {
            return;
        }
        player.pauseVideo();
        publicSocket.emit("video:pause");
    }

    async function skipBackward() {
        if (!player || !isRoomLeader) {
            return;
        }
        player.seekTo((await player.getCurrentTime<true>()) - 15, true);
        publicSocket.emit("video:skip:backward");
    }

    async function skipForward() {
        if (!player || !isRoomLeader) {
            return;
        }
        player.seekTo((await player.getCurrentTime<true>()) + 15, true);
        publicSocket.emit("video:skip:forward");
    }

    useEffect(() => {
        if (!player) {
            return;
        }
        function onStateChange(e: YT.PlayerEvent) {
            const state = e.target.getPlayerState();
            setPlayerState(state);

            const activeVideo = getActiveVideo();

            if (!activeVideo) {
                return;
            }

            // If video ended, leader calls to remove it from playlist
            if (isRoomLeader && state === 0) {
                publicSocket.emit("room:playlist:remove", {
                    roomId,
                    videoId: activeVideo.id,
                });
            }
        }
        player.addEventListener("onStateChange", onStateChange);
        return () => {
            player.removeEventListener("onStateChange", onStateChange);
        };
    }, [
        player,
        dispatchPlaylist,
        isRoomLeader,
        getActiveVideo,
        publicSocket,
        roomId,
    ]);

    return (
        <Flex justify="center" align="center" py="1rem" gridGap="0.5rem">
            <Button.Icon
                tooltip="Skip backward 15 seconds"
                mdi="mdiSkipBackward"
                onClick={skipBackward}
                disabled={player === undefined || !isRoomLeader}
            />
            <Button.Icon
                mdi="mdiSync"
                tooltip="Sync with room"
                onClick={sync}
                disabled={player === undefined || !isRoomLeader}
            />
            {playerState === 1 ? (
                <Button.Icon
                    tooltip="Pause"
                    onClick={pause}
                    mdi="mdiPause"
                    disabled={player === undefined || !isRoomLeader}
                />
            ) : (
                <Button.Icon
                    tooltip="Play"
                    onClick={play}
                    mdi="mdiPlay"
                    disabled={player === undefined || !isRoomLeader}
                />
            )}
            <Button.Icon
                tooltip="Skip forward 15 seconds"
                mdi="mdiSkipForward"
                onClick={skipForward}
                disabled={player === undefined || !isRoomLeader}
            />
        </Flex>
    );
}
