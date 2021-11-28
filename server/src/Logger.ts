import { join } from "path";
import { createLogger, format, transports } from "winston";

const { combine, timestamp, printf } = format;

type Level = "info" | "warn" | "error" | "debug";

process.on("uncaughtException", error => {
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
            filename: join(__dirname, `../logs/${level}.log`),
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
    level: "warn",
    format: customFormat,
    transports: customTransports("warn"),
});

const debugLogger = createLogger({
    level: "debug",
    format: customFormat,
    transports: customTransports("debug"),
});

export default class Logger {
    public static info(message: string) {
        infoLogger.info(message);
    }

    public static warn(message: string) {
        warningLogger.warn(message);
    }

    public static error(message: string) {
        errorLogger.error(message);
    }

    public static debug(message: string) {
        debugLogger.debug(message);
    }
}
