import { Box, Flex, Text } from "@chakra-ui/layout";
import { Select } from "@chakra-ui/select";
import { RoomPrivacy } from "domains/common/@types/room";
import { useContext, useEffect, useState } from "react";
import { uniqueNamesGenerator } from "unique-names-generator";
import { roomNameConfig } from "domains/common/config/uniqueNamesGenerator";
import { Input } from "@chakra-ui/input";
import Button from "domains/common/components/styles/button";
import { toast } from "react-toastify";
import { IErrorPayload } from "domains/common/@types/listener";
import { WebsocketContext } from "domains/public/contexts";
import Modal from "domains/common/components/styles/modal";
import { useHistory } from "react-router";
import MdiIcon from "domains/common/components/MdiIcon";

interface IProps {
    onClose(): void;
    isOpen?: boolean;
}

export function CreateRoom({ isOpen, onClose }: IProps) {
    const [submitting, setSubmitting] = useState(false);
    const [roomPrivacy, setRoomPrivacy] = useState<RoomPrivacy>("public");
    const [roomName, setRoomName] = useState(
        uniqueNamesGenerator(roomNameConfig)
    );
    const [roomPassword, setRoomPassword] = useState("");
    const { publicSocket } = useContext(WebsocketContext);
    const { push } = useHistory();

    function generateRoomName() {
        setRoomName(uniqueNamesGenerator(roomNameConfig));
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        if (submitting) {
            return toast.error("Room is already being created.");
        }
        if (!roomName) {
            return;
        }
        setSubmitting(true);
        const room = {
            privacy: roomPrivacy,
            name: roomName,
        };
        if (roomPrivacy === "private") {
            Object.assign(room, { password: roomPassword });
        }
        publicSocket.emit("room:create", room);
    }

    useEffect(() => {
        publicSocket.on("disconnect", onClose);
    }, [publicSocket, onClose]);

    useEffect(() => {
        publicSocket.on("room:create", (payload: { roomId: string }) => {
            setSubmitting(false);
            generateRoomName();
            setRoomPrivacy("public");
            setRoomPassword("");
            onClose();
            push({
                pathname: `/room/${payload.roomId}`,
                state: { password: roomPassword },
            });
        });
        return () => {
            publicSocket.off("room:create");
        };
    }, [publicSocket, onClose, push, roomPassword]);

    useEffect(() => {
        publicSocket.on("room:create:error", (payload: IErrorPayload) => {
            toast.error(`${payload.message}\n${payload.reason}`);
            setSubmitting(false);
        });
        publicSocket.on("disconnect", () => {
            setSubmitting(false);
        });
        return () => {
            publicSocket.off("room:create:error");
        };
    }, [publicSocket]);

    return (
        <Box>
            <Modal.Overlay isOpen={isOpen} />
            <Modal isOpen={isOpen} onClose={onClose} closeOnOutsideClick>
                <Modal.Content as="form" onSubmit={submit}>
                    <Modal.Header>Create room</Modal.Header>
                    <Modal.Body>
                        <Text fontWeight={600} mb="0.25rem">
                            Name
                        </Text>
                        <Flex mb="1rem">
                            <Input
                                placeholder="Fail compilations"
                                value={roomName}
                                h="2.5rem"
                                onChange={e => setRoomName(e.target.value)}
                            />
                            <Button
                                variant="secondary"
                                ml="0.25rem"
                                onClick={generateRoomName}
                                h="2.5rem"
                                w="2.5rem"
                                flexShrink={0}
                            >
                                <MdiIcon path="mdiRefresh" />
                            </Button>
                        </Flex>
                        <Flex mb="1rem" flexDir="column">
                            <Text fontWeight={600} mb="0.25rem">
                                Privacy
                            </Text>
                            <Select
                                defaultValue={roomPrivacy}
                                onChange={e =>
                                    setRoomPrivacy(
                                        e.target.value as RoomPrivacy
                                    )
                                }
                            >
                                <option value="public">Public</option>
                                <option value="private">Private</option>
                            </Select>
                        </Flex>
                        {roomPrivacy === "private" && (
                            <Flex flexDir="column" w="100%" mb="1rem">
                                <Text mb="0.25rem" fontWeight={600}>
                                    Password
                                </Text>
                                <Input
                                    autoFocus
                                    type="password"
                                    value={roomPassword}
                                    onChange={e =>
                                        setRoomPassword(e.target.value)
                                    }
                                />
                            </Flex>
                        )}
                        <Button
                            mt="1rem"
                            variant="primary"
                            type="submit"
                            isLoading={submitting}
                            size="btn-lg"
                            w="100%"
                        >
                            Submit
                        </Button>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </Box>
    );
}
