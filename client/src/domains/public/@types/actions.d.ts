import { IRoom } from "domains/common/@types/room";
import { ISocket } from "domains/common/@types/socket";

export type RoomsAction =
    | {
          type: "SET_ROOMS";
          rooms: IRoom[];
      }
    | {
          type: "ADD_ROOM";
          room: IRoom;
      }
    | {
          type: "REMOVE_ROOM";
          roomId: string;
      }
    | {
          type: "ADD_SOCKET_TO_ROOM";
          roomId: string;
          socket: ISocket;
      }
    | {
          type: "REMOVE_SOCKET_FROM_ROOM";
          roomId: string;
          socketId: string;
      }
    | {
          type: "UPDATE_ROOM_VIDEO";
          roomId: string;
          videoId: string;
      };
