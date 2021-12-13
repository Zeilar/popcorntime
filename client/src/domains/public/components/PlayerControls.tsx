import { useDisclosure } from "@chakra-ui/hooks";
import { Flex, Grid } from "@chakra-ui/layout";
import { useMediaQuery } from "@chakra-ui/media-query";
import { useTheme } from "@chakra-ui/system";
import MdiIcon from "domains/common/components/MdiIcon";
import { Prompt } from "domains/common/components/modals";
import Button from "domains/common/components/styles/button";
import {
    PasswordPromptModalContext,
    WebsocketContext,
} from "domains/public/contexts";
import { useState, useContext, useEffect } from "react";
import { useParams } from "react-router";
import { IRoomParams } from "../@types/params";
import { MeContext, RoomContext } from "../contexts";

interface IProps {
    player: YT.Player | undefined;
}

export default function PlayerControls({ player }: IProps) {
    const [playerState, setPlayerState] = useState(-1);
    const { isLeader, room, authorized } = useContext(RoomContext);
    const { me } = useContext(MeContext);
    const { publicSocket } = useContext(WebsocketContext);
    const passwordPrompt = useContext(PasswordPromptModalContext);
    const { roomId } = useParams<IRoomParams>();
    const theme = useTheme();
    const [isDesktop] = useMediaQuery(
        `(min-width: ${theme.breakpoints.desktop})`
    );
    const destroyPrompt = useDisclosure();

    const isRoomLeader = isLeader(me?.id);
    const canControl = isRoomLeader && player !== undefined && room?.videoId;

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

    function destroyRoom() {
        publicSocket.emit("room:destroy", roomId);
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

    return (
        <Grid
            gridTemplateColumns="repeat(3, 1fr)"
            p="1rem"
            gridGap="0.5rem"
            alignItems="center"
            justifyContent="center"
            boxShadow="elevate.top"
            zIndex={10}
            minH="4.5rem"
        >
            <Prompt
                header={`De stroy room ${room?.name}`}
                body="Are you sure? This cannot be undone!"
                onClose={destroyPrompt.onClose}
                isOpen={destroyPrompt.isOpen}
                onSubmit={destroyRoom}
            />
            <Flex gridColumnStart="2" justifyContent="center">
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
            <Flex justifyContent="flex-end">
                {isRoomLeader && (
                    <Button variant="danger" onClick={destroyPrompt.onOpen}>
                        <MdiIcon path="mdiTrashCan" mr={[null, "0.5rem"]} />
                        {isDesktop && "Destroy room"}
                    </Button>
                )}
                {authorized === false && (
                    <Button variant="primary" onClick={passwordPrompt.onOpen}>
                        <MdiIcon path="mdiLock" mr="0.25rem" />
                        Join
                    </Button>
                )}
            </Flex>
        </Grid>
    );
}
