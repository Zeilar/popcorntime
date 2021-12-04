import { Flex } from "@chakra-ui/layout";
import { useTitle } from "domains/common/hooks";
import { CreateRoom } from "../components/modals";

export function Home() {
    useTitle("SyncedTube");

    return (
        <Flex flexDir="column" alignItems="center" flexGrow={1}>
            <CreateRoom />
        </Flex>
    );
}
