import env from "config/env";

const { NODE_ENV } = process.env;
const { HOST_PORT, SECURE } = env;
const { hostname, protocol, host, origin } = window.location;

const HOSTNAME = NODE_ENV === "production" ? host : `${hostname}:${HOST_PORT}`;
export const HOST =
    NODE_ENV === "production" ? origin : `${protocol}//${HOSTNAME}`;
export const WS_HOST =
    NODE_ENV === "production" && SECURE
        ? `wss://${HOSTNAME}`
        : `ws://${HOSTNAME}`;
