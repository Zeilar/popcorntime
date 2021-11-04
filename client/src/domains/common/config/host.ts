const { NODE_ENV, REACT_APP_HOST_URL, REACT_APP_HOST_PORT } = process.env;

export const HOST =
    NODE_ENV === "production"
        ? REACT_APP_HOST_URL ?? ""
        : `http://localhost:${REACT_APP_HOST_PORT}`;

export const WS_HOST = HOST.replace("http", "ws"); // If url is https, it will take care of itself and become wss
