import { io } from "socket.io-client";
import { WS_HOST } from "../../common/config/host";

export const socket = io(WS_HOST, { reconnection: false });
