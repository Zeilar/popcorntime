declare namespace YT {
    interface Player {
        getPlayerState<TPromise extends true>(): Promise<PlayerState>;
        getCurrentTime<TPromise extends true>(): Promise<number>;
    }
}
