type Format =
    | "upper"
    | "lower"
    | "sentence"
    | "title"
    | "camel"
    | "pascal"
    | "snake"
    | "param"
    | "dot"
    | "path"
    | "constant";

declare module "@nwlongnecker/adjective-adjective-animal" {
    export default function generate(): Promise<string>;
    export default function generate(adjectives: number): Promise<string>;
    export default function generate(options: {
        adjectives: number;
        format: Format;
    }): Promise<string>;
}
