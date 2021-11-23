import { Flex } from "@chakra-ui/layout";
import Button from "domains/common/components/styles/button";
import { WebsocketContext } from "domains/common/contexts";
import { useState, useContext, useEffect } from "react";
import { MeContext, RoomContext } from "../contexts";

interface IProps {
    player: YT.Player | undefined;
}

export default function PlayerControls({ player }: IProps) {
    const [playerState, setPlayerState] = useState(-1);
    const { getLeader } = useContext(RoomContext);
    const { me } = useContext(MeContext);
    const { publicSocket } = useContext(WebsocketContext);

    const isLeader = getLeader()?.id === me.id;

    async function sync() {
        if (!player) {
            return;
        }
        publicSocket.emit("video:sync", await player.getCurrentTime<true>());
    }

    function play() {
        if (!player) {
            return;
        }
        player.playVideo();
        publicSocket.emit("video:play");
    }

    function pause() {
        if (!player) {
            return;
        }
        player.pauseVideo();
        publicSocket.emit("video:pause");
    }

    async function skipBackward() {
        if (!player) {
            return;
        }
        player.seekTo((await player.getCurrentTime<true>()) - 15, true);
        publicSocket.emit("video:skip:backward");
    }

    async function skipForward() {
        if (!player) {
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
            setPlayerState(e.target.getPlayerState());
        }
        player.addEventListener("onStateChange", onStateChange);
        return () => {
            player.removeEventListener("onStateChange", onStateChange);
        };
    }, [player]);

    return (
        <Flex justify="center" align="center" py="1rem" gridGap="0.5rem">
            <Button.Icon
                tooltip="Skip backward 15 seconds"
                mdi="mdiSkipBackward"
                onClick={skipBackward}
                disabled={player === null || !isLeader}
            />
            <Button.Icon
                mdi="mdiSync"
                tooltip="Sync with room"
                onClick={sync}
                disabled={player === null || !isLeader}
            />
            {playerState === 1 ? (
                <Button.Icon
                    tooltip="Pause"
                    onClick={pause}
                    mdi="mdiPause"
                    disabled={player === null || !isLeader}
                />
            ) : (
                <Button.Icon
                    tooltip="Play"
                    onClick={play}
                    mdi="mdiPlay"
                    disabled={player === null || !isLeader}
                />
            )}
            <Button.Icon
                tooltip="Skip forward 15 seconds"
                mdi="mdiSkipForward"
                onClick={skipForward}
                disabled={player === null || !isLeader}
            />
        </Flex>
    );
}
