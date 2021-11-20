const { NODE_ENV, REACT_APP_HOST_PORT } = process.env;
const { hostname } = window.location;

const HOSTNAME =
    NODE_ENV === "production" ? "" : `${hostname}:${REACT_APP_HOST_PORT}`;

export const HOST = NODE_ENV === "production" ? "/" : `http://${HOSTNAME}`;
export const WS_HOST = `ws://${HOSTNAME}`;
