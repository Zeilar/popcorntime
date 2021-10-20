import { useEffect } from "react";
import { toast } from "react-toastify";
import { socket } from "../App";

export default function useSocket() {
    useEffect(() => {
        socket.on("error", (error: string) => {
            toast.error(error);
        });
        return () => {
            socket.removeAllListeners();
            socket.disconnect();
        };
    }, []);
}
