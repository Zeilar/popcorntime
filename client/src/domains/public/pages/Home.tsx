import { Img } from "@chakra-ui/image";
import { Flex, Grid, Text } from "@chakra-ui/layout";
import env from "config/env";
import MdiIcon from "domains/common/components/MdiIcon";
import { useTitle } from "domains/common/hooks";
import { urlService } from "domains/common/services/urlService";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { RoomsContext } from "../contexts/RoomsContext";

export function Home() {
    const { rooms } = useContext(RoomsContext);

    useTitle("SyncedTube");

    return (
        <Grid
            flexDir="column"
            flexGrow={1}
            p="1rem"
            gridTemplateColumns="repeat(5, 1fr)"
            alignContent="start"
        >
            {rooms.map(room => (
                <Link to={`/room/${room.id}`}>
                    <Flex
                        key={room.id}
                        flexDir="column"
                        bgColor="gray.800"
                        boxShadow="elevate.all"
                    >
                        <Img src={urlService.youtubeThumbnail(room.videoId)} />
                        <Flex
                            p="1rem"
                            justifyContent="space-between"
                            flexWrap="wrap"
                        >
                            <Text>{room.name}</Text>
                            <Flex>
                                <Text>{`${room.sockets.length} / ${env.ROOM_MAX_SOCKETS}`}</Text>
                                <MdiIcon ml="0.5rem" path="mdiAccountGroup" />
                            </Flex>
                        </Flex>
                    </Flex>
                </Link>
            ))}
        </Grid>
    );
}
