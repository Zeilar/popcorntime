import { Flex, Grid } from "@chakra-ui/layout";
import { useState, useEffect, useContext } from "react";
import { Route, Switch } from "react-router";
import { toast } from "react-toastify";
import { IRoom } from "../../../common/@types/room";
import { ISocket } from "../../../common/@types/socket";
import { adminSocket } from "../../config/socket";
import { RoomContext } from "../../contexts";
import * as RoomActions from "../../state/actions/room";
import DashboardItem from "./DashboardItem";
import Rooms from "./room/Rooms";
import Sockets from "./Sockets";

export default function Dashboard() {
    const [sockets, setSockets] = useState<ISocket[]>([]);
    const { rooms, dispatchRooms } = useContext(RoomContext);

    useEffect(() => {
        adminSocket.on("error", (message: string) => {
            toast.error(message);
        });
        adminSocket.on("connect_error", (error) => {
            toast.error(error.message);
        });
        adminSocket.once(
            "connection:success",
            (data: { rooms: IRoom[]; sockets: ISocket[] }) => {
                dispatchRooms({
                    type: RoomActions.ADD_ROOMS,
                    rooms: data.rooms,
                });
                setSockets(data.sockets);
            }
        );
        adminSocket.on(
            "room:kick",
            (payload: { roomId: string; socketId: string }) => {
                dispatchRooms({
                    type: RoomActions.REMOVE_SOCKET_FROM_ROOM,
                    ...payload,
                });
                toast.info("Removed socket.");
            }
        );
        adminSocket.on("room:new", (room: IRoom) => {
            dispatchRooms({ type: RoomActions.ADD_ROOM, room });
        });
        adminSocket.on("room:delete", (roomId: string) => {
            dispatchRooms({ type: RoomActions.REMOVE_ROOM, roomId });
        });
        adminSocket.on("socket:connect", (socket: ISocket) => {
            setSockets((sockets) => [...sockets, socket]);
        });
        adminSocket.on("socket:disconnect", (socketId: string) => {
            setSockets((sockets) =>
                sockets.filter((socket) => socket.id !== socketId)
            );
        });
        adminSocket.on(
            "room:join",
            (payload: { socket: ISocket; roomId: string }) => {
                dispatchRooms({
                    type: RoomActions.ADD_SOCKET_TO_ROOM,
                    ...payload,
                });
            }
        );
        adminSocket.on(
            "room:leave",
            (payload: { socketId: string; roomId: string }) => {
                dispatchRooms({
                    type: RoomActions.REMOVE_SOCKET_FROM_ROOM,
                    ...payload,
                });
            }
        );
        return () => {
            adminSocket.removeAllListeners();
        };
    }, [dispatchRooms]);

    return (
        <Grid bgColor="gray.900" flexGrow={1} gridTemplateColumns="25rem 1fr">
            <Flex flexDir="column" bgColor="gray.700" p="0.5rem" boxShadow="md">
                <DashboardItem icon="mdiAccountGroupOutline" to="/admin/rooms">
                    Rooms
                </DashboardItem>
                <DashboardItem icon="mdiPowerSocket" to="/admin/sockets">
                    Sockets
                </DashboardItem>
            </Flex>
            <Switch>
                <Route path="/admin" exact>
                    Main
                </Route>
                <Route path="/admin/rooms" exact>
                    <Rooms rooms={rooms} />
                </Route>
                <Route path="/admin/sockets" exact>
                    <Sockets sockets={sockets} />
                </Route>
                <Route>404</Route>
            </Switch>
        </Grid>
    );
}
