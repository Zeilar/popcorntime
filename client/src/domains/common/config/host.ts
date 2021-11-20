const { NODE_ENV } = process.env;
const { host, origin } = window.location;

export const HOST = NODE_ENV === "production" ? "/" : origin;
export const WS_HOST = `ws://${host}`;
