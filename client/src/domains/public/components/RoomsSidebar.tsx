import { Flex } from "@chakra-ui/layout";
import { IRoom } from "domains/common/@types/room";
import { useContext, useEffect, useState } from "react";
import { WebsocketContext } from "../contexts";

export default function RoomsSidebar() {
    const { publicSocket } = useContext(WebsocketContext);
    const [rooms, setRooms] = useState<IRoom[]>([]);

    console.log({ rooms });

    useEffect(() => {
        publicSocket.emit("rooms:get");
        publicSocket.on("rooms:get", (rooms: IRoom[]) => {
            setRooms(rooms);
        });
        publicSocket.on("rooms:new", (room: IRoom) => {
            setRooms(rooms => [...rooms, room]);
        });
        publicSocket.on("rooms:destroy", (roomId: string) => {
            setRooms(rooms => rooms.filter(room => room.id !== roomId));
        });
        return () => {
            publicSocket.off("rooms:get");
        };
    }, [publicSocket]);

    return (
        <Flex boxShadow="elevate.right" h="100%" zIndex={100}>
            Sidebar
        </Flex>
    );
}
