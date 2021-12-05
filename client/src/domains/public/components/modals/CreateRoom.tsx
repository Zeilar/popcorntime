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

interface IProps {
    onClose?(): void;
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
        publicSocket.on("room:create", () => {
            setSubmitting(false);
            if (onClose) {
                onClose();
            }
        });
        return () => {
            publicSocket.off("room:create");
        };
    }, [publicSocket, onClose]);

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
            <Modal isOpen={isOpen} onClose={onClose} onClickOutside={onClose}>
                <Modal.Content as="form" onSubmit={submit}>
                    <Modal.Header>Create room</Modal.Header>
                    <Modal.Body>
                        <Text fontWeight={600} mb="0.25rem">
                            Name
                        </Text>
                        <Flex mb="1rem">
                            <Input
                                placeholder="Fail compilations"
                                px="0.5rem"
                                value={roomName}
                                onChange={e => setRoomName(e.target.value)}
                            />
                            <Button
                                ml="0.25rem"
                                onClick={generateRoomName}
                                variant="primary"
                            >
                                Generate
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
                            variant="primary"
                            type="submit"
                            isLoading={submitting}
                        >
                            Submit
                        </Button>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </Box>
    );
}
