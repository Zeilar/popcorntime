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
import { toast } from "react-toastify";
import { Checkbox } from "@chakra-ui/checkbox";

export function Home() {
    const [submitting, setSubmitting] = useState(false);
    const [roomPrivacy, setRoomPrivacy] = useState<RoomPrivacy>("public");
    const [roomName, setRoomName] = useState(
        uniqueNamesGenerator(roomNameConfig)
    );
    const [roomPassword, setRoomPassword] = useState("");
    const { publicSocket } = useContext(WebsocketContext);
    const [usePassword, setUsePassword] = useState(false);

    function generateRoomName() {
        setRoomName(uniqueNamesGenerator(roomNameConfig));
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        if (submitting) {
            return toast.error("Room is already being created.");
        }
        setSubmitting(true);
        const room = {
            privacy: roomPrivacy,
            name: roomName,
        };
        if (usePassword) {
            Object.assign(room, { password: roomPassword });
        }
        publicSocket.emit("room:create", room);
    }

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
                        <Button onClick={generateRoomName} variant="secondary">
                            Generate
                        </Button>
                    </Flex>
                </Flex>
                <Flex flexDir="column" w="100%" mb="1rem">
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
                <Flex flexDir="column" w="100%">
                    <Flex mb="0.25rem">
                        <Text fontWeight={600}>Password</Text>
                        <Checkbox
                            ml="0.5rem"
                            checked={usePassword}
                            onChange={e => setUsePassword(e.target.checked)}
                        />
                    </Flex>
                    <Input
                        type="password"
                        disabled={!usePassword}
                        value={roomPassword}
                        onChange={e => setRoomPassword(e.target.value)}
                    />
                </Flex>
                <Button
                    variant="primary"
                    mt="1rem"
                    flexGrow={0}
                    type="submit"
                    isLoading={submitting}
                >
                    Go
                </Button>
            </Flex>
        </Flex>
    );
}
