import curtain from "domains/public/assets/images/curtain.png";

type Size = "hq" | "mq" | "sd";

class UrlService {
    public youtubeThumbnail(videoId: string | null, size: Size = "mq") {
        return typeof videoId === "string"
            ? `https://img.youtube.com/vi/${videoId}/${size}default.jpg`
            : undefined;
    }

    public get curtainImage() {
        return curtain;
    }
}

export const urlService = new UrlService();
