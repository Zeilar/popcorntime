import { Flex, Text } from "@chakra-ui/layout";
import env from "config/env";
import { IRoom } from "domains/common/@types/room";
import { ISocket } from "domains/common/@types/socket";
import Button from "domains/common/components/styles/button";
import { useLocalStorage } from "domains/common/hooks";
import { useContext, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { WebsocketContext } from "../contexts";
import { RoomsContext } from "../contexts/RoomsContext";
import { RoomsActions } from "domains/public/state/actions/rooms";

export default function RoomsSidebar() {
    const { publicSocket } = useContext(WebsocketContext);
    const [isOpen, setIsOpen] = useLocalStorage("showRoomsSideBar", true);
    const { rooms, dispatchRooms } = useContext(RoomsContext);

    useEffect(() => {
        publicSocket.emit("rooms:get");
    }, [publicSocket]);

    useEffect(() => {
        publicSocket.on("rooms:get", (rooms: IRoom[]) => {
            dispatchRooms({
                type: RoomsActions.SET_ROOMS,
                rooms,
            });
        });
        publicSocket.on(
            "rooms:socket:join",
            (payload: { roomId: string; socket: ISocket }) => {
                dispatchRooms({
                    type: RoomsActions.ADD_SOCKET_TO_ROOM,
                    ...payload,
                });
            }
        );
        publicSocket.on(
            "rooms:socket:leave",
            (payload: { roomId: string; socketId: string }) => {
                dispatchRooms({
                    type: RoomsActions.REMOVE_SOCKET_FROM_ROOM,
                    ...payload,
                });
            }
        );
        publicSocket.on(
            "rooms:video:change",
            (payload: { roomId: string; videoId: string }) => {
                dispatchRooms({
                    type: RoomsActions.UPDATE_ROOM_VIDEO,
                    ...payload,
                });
            }
        );
        publicSocket.on("rooms:new", (room: IRoom) => {
            dispatchRooms({
                type: RoomsActions.ADD_ROOM,
                room,
            });
        });
        publicSocket.on("rooms:destroy", (roomId: string) => {
            dispatchRooms({
                type: RoomsActions.REMOVE_ROOM,
                roomId,
            });
        });
        publicSocket.on("disconnect", () => {
            dispatchRooms({
                type: RoomsActions.SET_ROOMS,
                rooms: [],
            });
        });
        return () => {
            publicSocket
                .off("rooms:get")
                .off("rooms:new")
                .off("rooms:destroy")
                .off("rooms:socket:join")
                .off("rooms:socket:leave");
        };
    }, [publicSocket, dispatchRooms]);

    return (
        <Flex
            display={["none", "flex"]}
            boxShadow="elevate.right"
            h="100%"
            zIndex={100}
            bgColor="gray.800"
            maxW={isOpen ? "18rem" : "3rem"}
            minW={isOpen ? "18rem" : "3rem"}
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
            {isOpen && (
                <Flex flexDir="column" overflowY="auto">
                    {rooms.map(room => (
                        <Flex
                            flexShrink={0}
                            justifyContent="space-between"
                            p="1rem"
                            fontWeight={600}
                            as={NavLink}
                            to={`/room/${room.id}`}
                            key={room.id}
                            pos="relative"
                            _hover={{ bgColor: "gray.600" }}
                            _activeLink={{
                                bgColor: "primary.dark",
                                _after: {
                                    content: `""`,
                                    pos: "absolute",
                                    w: "4px",
                                    h: "100%",
                                    bgColor: "primary.light",
                                    right: 0,
                                    top: 0,
                                },
                            }}
                        >
                            <Text>{room.name}</Text>
                            <Text ml="1rem" whiteSpace="nowrap">
                                {`${room.sockets.length} / ${env.ROOM_MAX_SOCKETS}`}
                            </Text>
                        </Flex>
                    ))}
                </Flex>
            )}
        </Flex>
    );
}
