import { useEffect } from "react";

export function useTitle(title?: string | null) {
    useEffect(() => {
        if (title) {
            document.title = title;
        }
    }, [title]);
}
