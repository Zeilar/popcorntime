import { isEqual } from "lodash";
import { useEffect, useRef, useState } from "react";

interface IArgs {
    condition?: boolean;
    mouseup?: boolean;
    onError?: (error: Error) => void;
}

export function useOnClickOutside<T extends HTMLElement>(
    callback?: (element?: T) => void,
    args?: IArgs
) {
    const [memoArgs, setMemoArgs] = useState<IArgs>();
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
                    console.warn("Ref is not assigned to an element.");
                    return;
                }
                if (memoArgs?.condition === false) {
                    return;
                }
                if (
                    !element.contains(e.target as Node) &&
                    typeof callback === "function"
                ) {
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
