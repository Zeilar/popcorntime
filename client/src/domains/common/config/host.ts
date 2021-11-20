const { NODE_ENV, REACT_APP_HOST_PORT, REACT_APP_SECURE } = process.env;
const { hostname, protocol, host, origin } = window.location;

const HOSTNAME =
    NODE_ENV === "production" ? host : `${hostname}:${REACT_APP_HOST_PORT}`;
export const HOST =
    NODE_ENV === "production" ? origin : `${protocol}//${HOSTNAME}`;
export const WS_HOST =
    NODE_ENV === "production" && REACT_APP_SECURE === "true"
        ? `wss://${HOSTNAME}`
        : `ws://${HOSTNAME}`;
