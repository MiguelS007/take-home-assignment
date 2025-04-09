import { Module } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from "@nestjs/config";
import { validate } from "./env.validation";
import { ConfigService } from "./config.service";

@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: [
        `.env.${process.env.NODE_ENV || "development"}.local`,
        ".env.local",
        ".env",
      ],
      isGlobal: true,
      cache: true,
      validate,
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
