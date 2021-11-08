/**
 * Run this check as soon as the app starts to make sure all the necessary env variables are in place.
 */

export {};

const {
    REACT_APP_HOST_PORT,
    REACT_APP_ROOM_MAX_MESSAGES,
    REACT_APP_ROOM_MAX_SOCKETS,
    REACT_APP_HOST_URL,
} = process.env;

const variables = {
    REACT_APP_HOST_PORT,
    REACT_APP_ROOM_MAX_MESSAGES,
    REACT_APP_ROOM_MAX_SOCKETS,
    REACT_APP_HOST_URL,
};
const notFound: string[] = [];

Object.entries(variables).forEach((variable) => {
    const [key, value] = variable;
    if (value === undefined) {
        notFound.push(key);
    }
});

if (notFound.length > 0) {
    throw new Error(`Missing env variable(s):\n${notFound.join(", ")}`);
}
