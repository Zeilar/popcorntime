declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: "development" | "production";
        PORT: string;
        ADMIN_PASSWORD: string;
    }
}
