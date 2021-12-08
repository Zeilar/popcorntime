import { useEffect } from "react";

export function useTitle(title: string | null | undefined) {
    useEffect(() => {
        if (title) {
            document.title = title;
        }
    }, [title]);
}
