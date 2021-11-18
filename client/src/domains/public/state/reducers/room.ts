import { ISocket } from "domains/common/@types/socket";
import { IVideo } from "domains/public/@types/video";
import * as Actions from "../actions/room";

export function playlistReducer(state: IVideo[], action: any): IVideo[] {
    function editPlaylist(id: string, cb: (video: IVideo) => IVideo) {
        return state.map(video => {
            if (video.id !== id) {
                return video;
            }
            return cb(video);
        });
    }

    switch (action.type) {
        case Actions.SET_PLAYLIST:
            return action.playlist;
        case Actions.ADD_TO_PLAYLIST:
            return [...state, action.video];
        case Actions.REMOVE_FROM_PLAYLIST:
            return state.filter(video => video.id !== action.id);
        default:
            return state;
    }
}

export function socketsReducer(state: ISocket[], action: any): ISocket[] {
    function editSocket(socketId: string, cb: (socket: ISocket) => ISocket) {
        return state.map(socket => {
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
            return [...state, action.socketId];
        case Actions.REMOVE_SOCKET:
            return state.filter(socket => socket.id !== action.socketId);
        case Actions.EDIT_SOCKET_COLOR:
            return editSocket(action.socketId, socket => ({
                ...socket,
                color: action.color,
            }));
        default:
            return state;
    }
}
