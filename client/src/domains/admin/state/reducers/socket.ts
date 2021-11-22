import { ISocket } from "domains/common/@types/socket";
import * as Actions from "../actions/socket";

export function socketReducer(state: ISocket[], action: any): ISocket[] {
    switch (action.type) {
        case Actions.SET_SOCKETS:
            return action.sockets;
        case Actions.ADD_SOCKET:
            return [...state, action.socket];
        case Actions.REMOVE_SOCKET:
            return state.filter(socket => socket.id !== action.socketId);
        default:
            return state;
    }
}
