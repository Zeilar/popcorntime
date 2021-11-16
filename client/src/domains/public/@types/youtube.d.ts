declare namespace YT {
    interface Player {
        // @ts-ignore
        getPlayerState<TPromise extends true>(): Promise<PlayerState>;
        // @ts-expect-error
        getCurrentTime<TPromise extends true>(): Promise<number>;
    }
}
