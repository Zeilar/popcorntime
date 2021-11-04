import { io } from "socket.io-client";
import { WS_HOST } from "../../common/config/host";

export const adminSocket = io(`${WS_HOST}/admin`, {
    reconnection: false,
    auth: { token: process.env.REACT_APP_ADMIN_PASSWORD },
});
