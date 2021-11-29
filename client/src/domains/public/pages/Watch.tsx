import { roomNameConfig } from "domains/common/config/uniqueNamesGenerator";
import { useEffect, useContext, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { toast } from "react-toastify";
import { uniqueNamesGenerator } from "unique-names-generator";
import { WebsocketContext } from "../contexts";

export function Watch() {
    const { push } = useHistory();
    const { search } = useLocation();
    const { publicSocket } = useContext(WebsocketContext);
    const [videoId, setVideoId] = useState<string | null | undefined>();

    useEffect(() => {
        const videoId = new URLSearchParams(search).get("v");
        setVideoId(videoId);
        console.log({ videoId });
    }, [search, publicSocket]);

    useEffect(() => {
        // If videoId is undefined, it has not yet been computed
        if (videoId === undefined) {
            return;
        }
        console.log("video id changed", videoId);
        if (videoId) {
            publicSocket.emit("room:create", {
                privacy: "public",
                name: uniqueNamesGenerator(roomNameConfig),
                videoId,
            });
        } else {
            toast.error("Invalid video id.");
            push("/");
        }
    }, [videoId, publicSocket, push]);

    return null;
}
