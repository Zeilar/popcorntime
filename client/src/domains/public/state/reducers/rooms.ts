import { IRoom } from "domains/common/@types/room";
import { RoomsAction } from "domains/public/@types/actions";
import * as Actions from "../actions/rooms";

export function roomsReducer(rooms: IRoom[], action: RoomsAction) {
    function editRoom(roomId: string, cb: (room: IRoom) => IRoom) {
        return rooms.map(room => (room.id === roomId ? cb(room) : room));
    }

    switch (action.type) {
        case Actions.SET_ROOMS:
            return action.rooms;
        case Actions.ADD_ROOM:
            return [...rooms, action.room];
        case Actions.REMOVE_ROOM:
            return rooms.filter(room => room.id !== action.roomId);
        case Actions.ADD_SOCKET_TO_ROOM:
            return editRoom(action.roomId, room => ({
                ...room,
                sockets: [...room.sockets, action.socket],
            }));
        case Actions.REMOVE_SOCKET_FROM_ROOM:
            return editRoom(action.roomId, room => ({
                ...room,
                sockets: room.sockets.filter(
                    socket => socket.id !== action.socketId
                ),
            }));
        case Actions.UPDATE_ROOM_VIDEO:
            return editRoom(action.roomId, room => ({
                ...room,
                videoId: action.videoId,
            }));
        default:
            return rooms;
    }
}
