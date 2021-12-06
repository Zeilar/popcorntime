import { useStorage } from "./";

export function useLocalStorage<T>(key: string, fallback: T) {
    return useStorage(localStorage, key, fallback);
}
