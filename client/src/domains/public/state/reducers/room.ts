import { ISocket } from "domains/common/@types/socket";
import { IVideo } from "domains/public/@types/video";
import * as Actions from "../actions/room";

export function playlistReducer(state: IVideo[], action: any): IVideo[] {
    const indexOfActive = state.findIndex(video => video.active);

    switch (action.type) {
        case Actions.SET_PLAYLIST:
            return action.playlist;
        case Actions.ADD_TO_PLAYLIST:
            return [...state, action.video];
        case Actions.REMOVE_FROM_PLAYLIST:
            return state.filter(video => video.id !== action.id);
        case Actions.PLAYLIST_ACTIVE_SET:
            return state.map(video => ({
                ...video,
                active: video.id === action.id,
            }));
        case Actions.PLAYLIST_ACTIVE_NEXT:
            return state.map((video, i) => ({
                ...video,
                active: i === indexOfActive + 1,
            }));
        case Actions.PLAYLIST_ACTIVE_PREVIOUS:
            return state.map((video, i) => ({
                ...video,
                active: i === indexOfActive - 1,
            }));

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
            return [...state, action.socket];
        case Actions.REMOVE_SOCKET:
            return state.filter(socket => socket.id !== action.socketId);
        case Actions.EDIT_SOCKET_COLOR:
            return editSocket(action.socket, socket => ({
                ...socket,
                color: action.color,
            }));
        default:
            return state;
    }
}
