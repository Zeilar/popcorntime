import { Img } from "@chakra-ui/image";
import { Flex, Grid, Text } from "@chakra-ui/layout";
import env from "config/env";
import MdiIcon from "domains/common/components/MdiIcon";
import { useTitle } from "domains/common/hooks";
import { urlService } from "domains/common/services";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { RoomsContext } from "../contexts/RoomsContext";

export function Home() {
    const { rooms } = useContext(RoomsContext);

    useTitle("SyncedTube");

    if (rooms.length === 0) {
        return (
            <Flex flexGrow={1} justifyContent="center" alignItems="center">
                <Text as="h2">There are no rooms, why not create one?</Text>
            </Flex>
        );
    }

    return (
        <Flex flexDir="column" p="1rem">
            <Text as="h2" mb="0.5rem">
                Public rooms
            </Text>
            <Grid
                flexDir="column"
                gridTemplateColumns="repeat(5, 1fr)"
                alignContent="start"
                gridGap="0.5rem"
            >
                {rooms.map(room => (
                    <Link to={`/room/${room.id}`} key={room.id}>
                        <Flex
                            flexDir="column"
                            bgColor="gray.800"
                            boxShadow="elevate.all"
                            h="100%"
                            rounded="sm"
                            _hover={{ boxShadow: "outline" }}
                        >
                            <Img
                                pointerEvents="none"
                                src={
                                    room.videoId
                                        ? urlService.youtubeThumbnail(
                                              room.videoId
                                          )
                                        : urlService.curtainImage
                                }
                            />
                            <Flex
                                mt="auto"
                                p="1rem"
                                justifyContent="space-between"
                                flexWrap="wrap"
                            >
                                <Text>{room.name}</Text>
                                <Flex>
                                    <Text>{`${room.sockets.length} / ${env.ROOM_MAX_SOCKETS}`}</Text>
                                    <MdiIcon
                                        ml="0.5rem"
                                        path="mdiAccountGroup"
                                    />
                                </Flex>
                            </Flex>
                        </Flex>
                    </Link>
                ))}
            </Grid>
        </Flex>
    );
}
