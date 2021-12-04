import { IRoom } from "domains/common/@types/room";
import { RoomsAction } from "domains/public/@types/actions";
import { RoomsActions } from "../actions/rooms";

export function roomsReducer(rooms: IRoom[], action: RoomsAction) {
    function editRoom(roomId: string, cb: (room: IRoom) => IRoom) {
        return rooms.map(room => (room.id === roomId ? cb(room) : room));
    }

    switch (action.type) {
        case RoomsActions.SET_ROOMS:
            return action.rooms;
        case RoomsActions.ADD_ROOM:
            return [...rooms, action.room];
        case RoomsActions.REMOVE_ROOM:
            return rooms.filter(room => room.id !== action.roomId);
        case RoomsActions.ADD_SOCKET_TO_ROOM:
            return editRoom(action.roomId, room => ({
                ...room,
                sockets: [...room.sockets, action.socket],
            }));
        case RoomsActions.REMOVE_SOCKET_FROM_ROOM:
            return editRoom(action.roomId, room => ({
                ...room,
                sockets: room.sockets.filter(
                    socket => socket.id !== action.socketId
                ),
            }));
        case RoomsActions.UPDATE_ROOM_VIDEO:
            return editRoom(action.roomId, room => ({
                ...room,
                videoId: action.videoId,
            }));
        default:
            return rooms;
    }
}
