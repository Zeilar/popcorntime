import { IRoom } from "domains/common/@types/room";
import { ISocket } from "domains/common/@types/socket";
import { RoomsActions } from "domains/public/state/actions/rooms";
import { RoomActions } from "domains/public/state/actions/room";
import { Color } from "domains/common/@types/color";

export type RoomsAction =
    | {
          type: RoomsActions.SET_ROOMS;
          rooms: IRoom[];
      }
    | {
          type: RoomsActions.ADD_ROOM;
          room: IRoom;
      }
    | {
          type: RoomsActions.REMOVE_ROOM;
          roomId: string;
      }
    | {
          type: RoomsActions.ADD_SOCKET_TO_ROOM;
          roomId: string;
          socket: ISocket;
      }
    | {
          type: RoomsActions.REMOVE_SOCKET_FROM_ROOM;
          roomId: string;
          socketId: string;
      }
    | {
          type: RoomsActions.UPDATE_ROOM_VIDEO;
          roomId: string;
          videoId: string;
      };

export type RoomAction =
    | {
          type: RoomActions.SET_SOCKETS;
          sockets: ISocket[];
      }
    | {
          type: RoomActions.ADD_SOCKET;
          socket: ISocket;
      }
    | {
          type: RoomActions.REMOVE_SOCKET;
          socketId: string;
      }
    | {
          type: RoomActions.EDIT_SOCKET_COLOR;
          socketId: string;
          color: Color;
      };
