import { useStorage } from "./";

export function useSessionStorage<T>(key: string, fallback: T) {
    return useStorage(sessionStorage, key, fallback);
}
