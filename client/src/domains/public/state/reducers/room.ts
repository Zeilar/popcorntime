import { ISocket } from "domains/common/@types/socket";
import * as Actions from "../actions/room";

export function socketsReducer(sockets: ISocket[], action: any): ISocket[] {
    function editSocket(socketId: string, cb: (socket: ISocket) => ISocket) {
        return sockets.map(socket => {
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
            return [...sockets, action.socket];
        case Actions.REMOVE_SOCKET:
            return sockets.filter(socket => socket.id !== action.socketId);
        case Actions.EDIT_SOCKET_COLOR:
            return editSocket(action.socket, socket => ({
                ...socket,
                color: action.color,
            }));
        default:
            return sockets;
    }
}
