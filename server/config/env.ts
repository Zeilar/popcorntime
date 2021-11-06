import "dotenv/config";

/**
 * Run this check as soon as the app starts to make sure all the necessary env variables are in place.
 */

const { ADMIN_PASSWORD, NODE_ENV, PORT } = process.env;

const variables = { ADMIN_PASSWORD, NODE_ENV, PORT };
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
