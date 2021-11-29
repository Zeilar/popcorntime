declare namespace NodeJS {
    interface ProcessEnv {
        REACT_APP_HOST_PORT: string;
        REACT_APP_ROOM_MAX_MESSAGES: string;
        REACT_APP_ROOM_MAX_SOCKETS: string;
        REACT_APP_ROOM_MAX_PLAYLIST: string;
        REACT_APP_MAX_ROOMS: string;
        REACT_APP_SECURE: "true" | "false";
        REACT_APP_VERSION: string;
    }
}
