import { isEqual } from "lodash";
import { useEffect, useRef, useState } from "react";

interface Args {
    condition?: boolean;
    mouseup?: boolean;
    onError?: (error: Error) => void;
}

export function useOnClickOutside<T extends HTMLElement>(
    callback: (element?: T) => void,
    args?: Args
) {
    const [memoArgs, setMemoArgs] = useState<Args>();
    const ref = useRef<T>(null);

    // This is to avoid infinite loops in the useEffect as args contains non-primitives
    useEffect(() => {
        if (!isEqual(memoArgs, args)) {
            setMemoArgs(args);
        }
    }, [args, memoArgs]);

    useEffect(() => {
        const element = ref.current;
        const event = memoArgs?.mouseup ? "mouseup" : "mousedown";

        function clickHandler(e: MouseEvent): void {
            try {
                if (!element) {
                    throw new Error("Ref must be assigned to an element.");
                }
                if (memoArgs?.condition === false) {
                    return;
                }
                if (!element.contains(e.target as Node)) {
                    callback(element);
                }
            } catch (error) {
                console.error(error);
                if (memoArgs?.onError) {
                    memoArgs.onError(error as Error);
                }
            }
        }

        document.addEventListener(event, clickHandler);

        return () => {
            document.removeEventListener(event, clickHandler);
        };
    }, [callback, memoArgs]);

    return ref;
}
