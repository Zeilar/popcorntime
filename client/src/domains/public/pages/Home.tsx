import { Flex, Text } from "@chakra-ui/layout";
import { Select } from "@chakra-ui/select";
import { RoomPrivacy } from "domains/common/@types/room";
import { useContext, useEffect, useState } from "react";
import { uniqueNamesGenerator } from "unique-names-generator";
import { roomNameConfig } from "domains/common/config/uniqueNamesGenerator";
import { Input } from "@chakra-ui/input";
import Button from "domains/common/components/styles/button";
import ContainerSpinner from "domains/common/components/ContainerSpinner";
import { AnimatePresence } from "framer-motion";
import { WebsocketContext } from "../contexts";
import { useHistory, useLocation } from "react-router";
import { toast } from "react-toastify";
import { validate } from "uuid";

export function Home() {
    const [submitting, setSubmitting] = useState(false);
    const [roomPrivacy, setRoomPrivacy] = useState<RoomPrivacy>("public");
    const [roomName, setRoomName] = useState(
        uniqueNamesGenerator(roomNameConfig)
    );
    const { publicSocket } = useContext(WebsocketContext);
    const { push } = useHistory();
    const { search } = useLocation();

    function generateRoomName() {
        setRoomName(uniqueNamesGenerator(roomNameConfig));
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        if (submitting) {
            return toast.error("Room is already being created.");
        }
        setSubmitting(true);
        publicSocket.emit("room:create", {
            privacy: roomPrivacy,
            name: roomName,
        });
    }

    useEffect(() => {
        if (!publicSocket.connected) {
            return;
        }
        const videoId = new URLSearchParams(search).get("v");
        if (videoId) {
            publicSocket.emit("room:create", {
                privacy: "public",
                name: uniqueNamesGenerator(roomNameConfig),
                videoId,
            });
            setSubmitting(true);
        }
    }, [search, publicSocket, publicSocket.connected]);

    useEffect(() => {
        publicSocket.on(
            "room:create",
            (payload: { roomId: string; videoId?: string | null }) => {
                if (!validate(payload.roomId)) {
                    return toast.error("Invalid room id.");
                }
                push(`/room/${payload.roomId}`);
            }
        );
        return () => {
            publicSocket.off("room:create");
        };
    }, [publicSocket, push]);

    useEffect(() => {
        publicSocket.on("disconnect", () => {
            setSubmitting(false);
        });
        return () => {
            publicSocket.off("disconnect");
        };
    }, [publicSocket]);

    return (
        <Flex
            flexDir="column"
            alignItems="center"
            justifyContent="center"
            flexGrow={1}
        >
            <Flex
                flexDir="column"
                bgColor="gray.600"
                rounded="base"
                boxShadow="elevate.all"
                pos="relative"
                alignItems="flex-start"
                p="2rem"
                as="form"
                onSubmit={submit}
            >
                <AnimatePresence>
                    {submitting && <ContainerSpinner />}
                </AnimatePresence>
                <Text as="h2" mb="1rem">
                    Create room
                </Text>
                <Flex flexDir="column" mb="1rem">
                    <Text fontWeight={600} mb="0.25rem">
                        Name
                    </Text>
                    <Flex>
                        <Input
                            placeholder="Fail compilations"
                            value={roomName}
                            onChange={e => setRoomName(e.target.value)}
                            mr="0.5rem"
                        />
                        <Button.Secondary onClick={generateRoomName}>
                            Generate
                        </Button.Secondary>
                    </Flex>
                </Flex>
                <Flex flexDir="column" w="100%">
                    <Text fontWeight={600} mb="0.25rem">
                        Privacy
                    </Text>
                    <Select
                        defaultValue={roomPrivacy}
                        onChange={e =>
                            setRoomPrivacy(e.target.value as RoomPrivacy)
                        }
                    >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                    </Select>
                </Flex>
                <Button.Primary
                    mt="1rem"
                    flexGrow={0}
                    type="submit"
                    isLoading={submitting}
                >
                    Go
                </Button.Primary>
            </Flex>
        </Flex>
    );
}
