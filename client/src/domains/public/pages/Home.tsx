import { Flex, Text } from "@chakra-ui/layout";
import { Select } from "@chakra-ui/select";
import { RoomPrivacy } from "domains/common/@types/room";
import { useState } from "react";
import { uniqueNamesGenerator } from "unique-names-generator";
import { roomNameConfig } from "domains/common/config/uniqueNamesGenerator";
import { Input } from "@chakra-ui/input";
import Button from "domains/common/components/styles/button";

export function Home() {
    const [roomPrivacy, setRoomPrivacy] = useState<RoomPrivacy>("public");
    const [roomName, setRoomName] = useState(
        uniqueNamesGenerator(roomNameConfig)
    );

    function generateRoomName() {
        setRoomName(uniqueNamesGenerator(roomNameConfig));
    }

    return (
        <Flex
            flexDir="column"
            alignItems="center"
            justifyContent="center"
            flexGrow={1}
        >
            <Flex
                flexDir="column"
                bgColor="gray.700"
                rounded="base"
                boxShadow="elevate.all"
                alignItems="flex-start"
                p="2rem"
            >
                <Text as="h2" mb="1rem">
                    Create room
                </Text>
                <Flex flexDir="column" mb="1rem">
                    <Text mb="0.25rem">Name</Text>
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
                    <Text mb="0.25rem">Privacy</Text>
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
                <Button.Primary mt="1rem" flexGrow={0}>
                    Go
                </Button.Primary>
            </Flex>
        </Flex>
    );
}
