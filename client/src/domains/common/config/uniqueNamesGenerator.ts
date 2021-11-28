import { animals, adjectives, Config } from "unique-names-generator";

export const socketNameConfig: Config = {
    dictionaries: [animals],
    separator: " ",
    style: "capital",
    length: 1,
};

export const roomNameConfig: Config = {
    dictionaries: [adjectives, animals],
    separator: " ",
    style: "capital",
    length: 2,
};
