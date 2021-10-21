export class Socket {
    constructor(
        public readonly id: string,
        public readonly username: string,
        public readonly color: string // make type Color
    ) {}

    public randomName() {
        return this;
    }

    public randomColor() {
        return this;
    }
}
