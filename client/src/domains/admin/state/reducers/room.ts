import { IRoom } from "../../../common/@types/room";
import * as Actions from "../actions/room";

interface IAction {
    type: string;
    [key: string]: any;
}

export function roomReducer(state: IRoom[], action: IAction): IRoom[] {
    switch (action.type) {
        case Actions.ADD_ROOMS:
            return [...state, ...action.rooms];
        case Actions.ADD_ROOM:
            return [...state, action.room];
        case Actions.REMOVE_ROOM:
            return state.filter((room) => room.id !== action.roomId);
        case Actions.ADD_SOCKET_TO_ROOM:
            return state.map((room) => {
                if (room.id !== action.roomId) {
                    return room;
                }
                return {
                    ...room,
                    sockets: [...room.sockets, action.socket],
                };
            });
        case Actions.REMOVE_SOCKET_FROM_ROOM:
            return state.map((room) => {
                if (room.id !== action.roomId) {
                    return room;
                }
                return {
                    ...room,
                    sockets: room.sockets.filter(
                        (socket) => socket.id !== action.socketId
                    ),
                };
            });
        default:
            return state;
    }
}
