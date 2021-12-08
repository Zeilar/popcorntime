import { useCallback, useEffect, useState } from "react";

export function useStorage<T>(storage: Storage, key: string, fallback: T) {
    const parseData = useCallback(() => {
        try {
            const data = storage.getItem(key);
            return typeof data === "string"
                ? (JSON.parse(data) as T)
                : fallback;
        } catch (error) {
            return fallback;
        }
    }, [key, storage, fallback]);

    const [data, setData] = useState<T>(parseData);

    useEffect(() => {
        setData(parseData());
    }, [key, parseData]);

    useEffect(() => {
        storage.setItem(key, JSON.stringify(data));
    }, [key, storage, data]);

    return [data, setData] as const;
}
