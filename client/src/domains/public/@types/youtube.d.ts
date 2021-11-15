declare namespace YT {
    interface Player {
        getPlayerState(): Promise<PlayerState>;
    }
}
