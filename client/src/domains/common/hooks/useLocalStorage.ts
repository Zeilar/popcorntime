import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initial?: T) {
    const [data, setData] = useState<T | null>(() => {
        if (initial !== undefined) {
            return initial;
        }
        const data = localStorage.getItem(key);
        return typeof data === "string" ? (JSON.parse(data) as T) : null;
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(data));
    }, [data, key]);

    return [data, setData] as const;
}
