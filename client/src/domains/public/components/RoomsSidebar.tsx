import { Flex, Text } from "@chakra-ui/layout";
import env from "config/env";
import { IRoom } from "domains/common/@types/room";
import Button from "domains/common/components/styles/button";
import { useLocalStorage } from "domains/common/hooks";
import { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { WebsocketContext } from "../contexts";

export default function RoomsSidebar() {
    const { publicSocket } = useContext(WebsocketContext);
    const [rooms, setRooms] = useState<IRoom[]>([]);
    const [isOpen, setIsOpen] = useLocalStorage("showRoomsSideBar", true);

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
        publicSocket.on("disconnect", () => {
            setRooms([]);
        });
        return () => {
            publicSocket
                .off("rooms:get")
                .off("rooms:new")
                .off("rooms:destroy")
                .off("disconnect");
        };
    }, [publicSocket]);

    return (
        <Flex
            boxShadow="elevate.right"
            h="100%"
            zIndex={100}
            bgColor="gray.800"
            w={isOpen ? "15rem" : "3rem"}
            flexDir="column"
        >
            <Flex
                alignItems="center"
                justifyContent="space-between"
                p="0.5rem"
                zIndex={10}
                boxShadow="elevate.bottom"
            >
                {isOpen && (
                    <Text
                        textTransform="uppercase"
                        fontWeight={600}
                        fontSize="sm"
                    >
                        Public rooms
                    </Text>
                )}
                {isOpen ? (
                    <Button.Icon
                        onClick={() => setIsOpen(false)}
                        mdi="mdiArrowCollapseLeft"
                        tooltip="Hide sidebar"
                    />
                ) : (
                    <Button.Icon
                        onClick={() => setIsOpen(true)}
                        mdi="mdiArrowExpandRight"
                        tooltip="Show sidebar"
                    />
                )}
            </Flex>
            {isOpen &&
                rooms.map(room => (
                    <Flex
                        justifyContent="space-between"
                        p="0.5rem"
                        fontWeight={600}
                        as={NavLink}
                        to={`/room/${room.id}`}
                        key={room.id}
                        _hover={{ bgColor: "gray.600" }}
                        _active={{ bgColor: "gray.500" }}
                        _activeLink={{ bgColor: "brand.default" }}
                    >
                        <Text>{room.name}</Text>
                        <Text ml="1rem" whiteSpace="nowrap">
                            {`${room.sockets.length} / ${env.ROOM_MAX_SOCKETS}`}
                        </Text>
                    </Flex>
                ))}
        </Flex>
    );
}
