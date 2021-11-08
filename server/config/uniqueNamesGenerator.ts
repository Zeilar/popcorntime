import { adjectives, animals, Config } from "unique-names-generator";

export const nameConfig: Config = {
    dictionaries: [adjectives, animals],
    separator: " ",
    style: "capital",
    length: 2,
};
