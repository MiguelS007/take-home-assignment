import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { LoggingService } from "../logging/logging.service";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly logger: LoggingService) {
    super({
      log:
        process.env.NODE_ENV === "development"
          ? ["query", "info", "warn", "error"]
          : ["error"],
    });
    this.logger.setContext("PrismaService");
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log("Successfully connected to database");
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log("Successfully disconnected from database");
  }
}
