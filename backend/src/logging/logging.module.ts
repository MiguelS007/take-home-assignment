import { Module } from "@nestjs/common";
import { WinstonModule } from "nest-winston";
import { ConfigModule, ConfigService } from "@nestjs/config";
import * as winston from "winston";
import "winston-daily-rotate-file";
import { LoggingService } from "./logging.service";

@Module({
  imports: [
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get("NODE_ENV") === "production";

        const consoleFormat = winston.format.combine(
          winston.format.timestamp(),
          winston.format.colorize(),
          winston.format.printf(
            ({ timestamp, level, message, context, trace, ...meta }) => {
              return `${timestamp} [${level}] [${context || "Application"}]: ${message}${
                trace ? `\n${trace}` : ""
              }${Object.keys(meta).length ? `\n${JSON.stringify(meta)}` : ""}`;
            }
          )
        );

        const jsonFormat = winston.format.combine(
          winston.format.timestamp(),
          winston.format.json()
        );

        const fileTransport = new winston.transports.DailyRotateFile({
          filename: "logs/application-%DATE%.log",
          datePattern: "YYYY-MM-DD",
          zippedArchive: true,
          maxSize: "20m",
          maxFiles: "14d",
          format: jsonFormat,
        });

        return {
          transports: [
            new winston.transports.Console({
              level: isProduction ? "info" : "debug",
              format: consoleFormat,
            }),
            fileTransport,
            new winston.transports.DailyRotateFile({
              filename: "logs/error-%DATE%.log",
              datePattern: "YYYY-MM-DD",
              zippedArchive: true,
              maxSize: "20m",
              maxFiles: "14d",
              level: "error",
              format: jsonFormat,
            }),
          ],
        };
      },
    }),
  ],
  providers: [LoggingService],
  exports: [LoggingService],
})
export class LoggingModule {}
