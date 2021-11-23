import env from "config/env";
import { IRoom } from "domains/common/@types/room";
import * as Actions from "../actions/room";

export function roomReducer(state: IRoom[], action: any): IRoom[] {
    function editRoom(roomId: string, cb: (room: IRoom) => IRoom) {
        return state.map(room => {
            if (room.id !== roomId) {
                return room;
            }
            return cb(room);
        });
    }

    switch (action.type) {
        case Actions.SET_ROOMS:
            return action.rooms;
        case Actions.ADD_ROOMS:
            return [...state, ...action.rooms];
        case Actions.ADD_ROOM:
            return [...state, action.room];
        case Actions.REMOVE_ROOM:
            return state.filter(room => room.id !== action.roomId);
        case Actions.ADD_SOCKET_TO_ROOM:
            return editRoom(action.roomId, room => ({
                ...room,
                sockets: [...room.sockets, action.socketId],
            }));
        case Actions.REMOVE_SOCKET_FROM_ROOM:
            return editRoom(action.roomId, room => ({
                ...room,
                sockets: room.sockets.filter(
                    socketId => socketId !== action.socketId
                ),
            }));
        case Actions.ADD_MESSAGE:
            return editRoom(action.roomId, room => {
                const messages = [...room.messages, action.message];
                if (messages.length > env.ROOM_MAX_MESSAGES) {
                    messages.shift();
                }
                return {
                    ...room,
                    messages,
                };
            });
        default:
            return state;
    }
}
