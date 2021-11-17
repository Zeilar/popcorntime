import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, fallback: T) {
    const [data, setData] = useState<T>(() => {
        const data = localStorage.getItem(key);
        return typeof data === "string" ? (JSON.parse(data) as T) : fallback;
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(data));
    }, [data, key]);

    return [data, setData] as const;
}
