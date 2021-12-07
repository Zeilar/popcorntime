import { useEffect, useState } from "react";

export function useStorage<T>(storage: Storage, key: string, fallback: T) {
    const [data, setData] = useState<T>(() => {
        try {
            const data = storage.getItem(key);
            return typeof data === "string"
                ? (JSON.parse(data) as T)
                : fallback;
        } catch (error) {
            return fallback;
        }
    });

    useEffect(() => {
        storage.setItem(key, JSON.stringify(data));
    }, [data, key, storage]);

    return [data, setData] as const;
}
