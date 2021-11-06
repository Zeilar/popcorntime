import { Grid } from "@chakra-ui/layout";
import { IRoom } from "domains/common/@types/room";
import Room from "./Room";

interface IProps {
    rooms: IRoom[];
}

export default function Rooms({ rooms }: IProps) {
    return (
        <Grid
            gridTemplateColumns="repeat(6, 1fr)"
            gridGap="0.5rem"
            p="0.5rem"
            overflowY="auto"
            alignContent="start"
        >
            {rooms.map((room) => (
                <Room room={room} key={room.id} />
            ))}
        </Grid>
    );
}
