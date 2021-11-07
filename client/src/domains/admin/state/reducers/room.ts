import { IRoom } from "domains/common/@types/room";
import * as Actions from "../actions/room";

const { REACT_APP_ROOM_MAX_MESSAGES } = process.env;

export function roomReducer(state: IRoom[], action: any): IRoom[] {
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
        case Actions.ADD_MESSAGE:
            return state.map((room) => {
                if (room.id !== action.roomId) {
                    return room;
                }
                const messages = [...room.messages, action.message];
                if (messages.length > parseInt(REACT_APP_ROOM_MAX_MESSAGES)) {
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
