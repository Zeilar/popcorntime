type Size = "hq" | "mq" | "sd";

class UrlService {
    public youtubeThumbnail(videoId: string | null, size: Size = "mq") {
        return typeof videoId === "string"
            ? `https://img.youtube.com/vi/${videoId}/${size}default.jpg`
            : undefined;
    }
}

export const urlService = new UrlService();
