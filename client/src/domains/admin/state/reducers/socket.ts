import { ISocket } from "domains/common/@types/socket";
import * as Actions from "../actions/socket";

export function socketReducer(state: ISocket[], action: any): ISocket[] {
    function editSocket(socketId: string, cb: (socket: ISocket) => ISocket) {
        return state.map((socket) => {
            if (socket.id !== socketId) {
                return socket;
            }
            return cb(socket);
        });
    }

    switch (action.type) {
        case Actions.SET_SOCKETS:
            return action.sockets;
        case Actions.ADD_SOCKET:
            return [...state, action.socket];
        case Actions.REMOVE_SOCKET:
            return state.filter((socket) => socket.id !== action.socketId);
        default:
            return state;
    }
}
