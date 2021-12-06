import { useEffect, useState } from "react";

type Storage =
    | typeof globalThis.sessionStorage
    | typeof globalThis.localStorage;

export function useStorage<T>(storage: Storage, key: string, fallback: T) {
    const [data, setData] = useState<T>(() => {
        const data = storage.getItem(key);
        return typeof data === "string" ? (JSON.parse(data) as T) : fallback;
    });

    useEffect(() => {
        storage.setItem(key, JSON.stringify(data));
    }, [data, key, storage]);

    return [data, setData] as const;
}
