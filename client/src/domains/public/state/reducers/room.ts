import { ISocket } from "domains/common/@types/socket";
import { RoomAction } from "domains/public/@types/actions";
import { RoomActions } from "../actions/room";

export function socketsReducer(
    sockets: ISocket[],
    action: RoomAction
): ISocket[] {
    function editSocket(socketId: string, cb: (socket: ISocket) => ISocket) {
        return sockets.map(socket => {
            if (socket.id !== socketId) {
                return socket;
            }
            return cb(socket);
        });
    }

    switch (action.type) {
        case RoomActions.SET_SOCKETS:
            return action.sockets;
        case RoomActions.ADD_SOCKET:
            return [...sockets, action.socket];
        case RoomActions.REMOVE_SOCKET:
            return sockets.filter(socket => socket.id !== action.socketId);
        case RoomActions.EDIT_SOCKET_COLOR:
            return editSocket(action.socketId, socket => ({
                ...socket,
                color: action.color,
            }));
        default:
            return sockets;
    }
}
