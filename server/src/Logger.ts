import { createLogger, format, transports } from "winston";

const { combine, timestamp, printf } = format;

type Level = "info" | "warning" | "error" | "debug";

process.on("uncaughtException", (error) => {
    Logger.error(error.stack ?? error.message);
    process.exit(1);
});

const customFormat = combine(
    format.colorize(),
    timestamp({ format: "HH:mm:ss" }),
    printf(
        ({ level, message, timestamp }) => `${timestamp} [${level}]: ${message}`
    )
);

function customTransports(level: Level) {
    return [
        new transports.Console(),
        new transports.File({
            filename: `logs/${level}.log`,
            level,
        }),
    ];
}

const errorLogger = createLogger({
    level: "error",
    format: customFormat,
    transports: customTransports("error"),
});

const infoLogger = createLogger({
    level: "info",
    format: customFormat,
    transports: customTransports("info"),
});

const warningLogger = createLogger({
    level: "warning",
    format: customFormat,
    transports: customTransports("warning"),
});

export default class Logger {
    public static info(message: string) {
        infoLogger.log("info", message);
        return this;
    }

    public static warning(message: string) {
        warningLogger.log("warning", message);
        return this;
    }

    public static error(message: string) {
        errorLogger.log("error", message);
        return this;
    }
}
