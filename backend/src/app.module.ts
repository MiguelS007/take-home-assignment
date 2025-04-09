import { Module } from "@nestjs/common";
import { CacheModule } from "@nestjs/cache-manager";
import { UsersModule } from "./users/users.module";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { LoggingModule } from "./logging/logging.module";
import { ConfigModule } from "./config/config.module";
import { ConfigService } from "./config/config.service";
import { redisStore } from "cache-manager-redis-yet";
import { createClient } from "redis";

@Module({
  imports: [
    ConfigModule,
    LoggingModule,
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const client = createClient({
          url: `redis://${configService.redisHost}:${configService.redisPort}`,
        });
        await client.connect();

        return {
          store: redisStore,
          client,
          ttl: 120,
        };
      },
      inject: [ConfigService],
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
