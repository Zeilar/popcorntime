import { Flex } from "@chakra-ui/layout";
import Button from "domains/common/components/styles/button";
import { WebsocketContext } from "domains/public/contexts";
import { useState, useContext, useEffect } from "react";
import { useParams } from "react-router";
import { IRoomParams } from "../@types/params";
import { MeContext, RoomContext } from "../contexts";

interface IProps {
    player: YT.Player | undefined;
}

export default function PlayerControls({ player }: IProps) {
    const [playerState, setPlayerState] = useState(-1);
    const { isLeader, room } = useContext(RoomContext);
    const { me } = useContext(MeContext);
    const { publicSocket } = useContext(WebsocketContext);
    const { roomId } = useParams<IRoomParams>();
    const [canControl, setCanControl] = useState(false);

    const isRoomLeader = isLeader(me?.id);

    // console.log(room?.videoId, isRoomLeader, player);

    async function sync() {
        if (!canControl) {
            return;
        }
        publicSocket.emit("video:sync", await player?.getCurrentTime<true>());
    }

    function play() {
        if (!canControl) {
            return;
        }
        player?.playVideo();
        publicSocket.emit("video:play");
    }

    function pause() {
        if (!canControl) {
            return;
        }
        player?.pauseVideo();
        publicSocket.emit("video:pause");
    }

    async function skipBackward() {
        if (!canControl) {
            return;
        }
        player?.seekTo((await player?.getCurrentTime<true>()) - 15, true);
        publicSocket.emit("video:skip:backward");
    }

    async function skipForward() {
        if (!canControl) {
            return;
        }
        player?.seekTo((await player?.getCurrentTime<true>()) + 15, true);
        publicSocket.emit("video:skip:forward");
    }

    useEffect(() => {
        if (!player) {
            return;
        }
        function onStateChange(e: YT.PlayerEvent) {
            const state = e.target.getPlayerState();
            setPlayerState(state);
        }
        player.addEventListener("onStateChange", onStateChange);
        return () => {
            player.removeEventListener("onStateChange", onStateChange);
        };
    }, [player, isRoomLeader, publicSocket, room?.videoId, roomId]);

    useEffect(() => {
        console.log("can control?", isRoomLeader, player, room?.videoId);
        setCanControl(
            Boolean(isRoomLeader && player !== undefined && room?.videoId)
        );
    }, [room?.videoId, isRoomLeader, player]);

    return (
        <Flex
            justify="center"
            align="center"
            py="1rem"
            gridGap="0.5rem"
            boxShadow="elevate.top"
            zIndex={10}
        >
            <Button.Icon
                tooltip="Skip backward 15 seconds"
                mdi="mdiSkipBackward"
                onClick={skipBackward}
                disabled={!canControl}
            />
            <Button.Icon
                mdi="mdiSync"
                tooltip="Sync with room"
                onClick={sync}
                disabled={!canControl}
            />
            {playerState === 1 ? (
                <Button.Icon
                    tooltip="Pause"
                    onClick={pause}
                    mdi="mdiPause"
                    disabled={!canControl}
                />
            ) : (
                <Button.Icon
                    tooltip="Play"
                    onClick={play}
                    mdi="mdiPlay"
                    disabled={!canControl}
                />
            )}
            <Button.Icon
                tooltip="Skip forward 15 seconds"
                mdi="mdiSkipForward"
                onClick={skipForward}
                disabled={!canControl}
            />
        </Flex>
    );
}
