import { Injectable } from "@nestjs/common";
import { ConfigService as NestConfigService } from "@nestjs/config";

@Injectable()
export class ConfigService {
  constructor(private configService: NestConfigService) {}

  get isProduction(): boolean {
    return this.nodeEnv === "production";
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === "development";
  }

  get isTest(): boolean {
    return this.nodeEnv === "test";
  }

  get nodeEnv(): string {
    return this.configService.get<string>("NODE_ENV") || "development";
  }

  get port(): number {
    return this.configService.get<number>("PORT") || 3001;
  }

  get databaseUrl(): string {
    const url = this.configService.get<string>("DATABASE_URL");
    if (!url) {
      throw new Error("DATABASE_URL is not defined in environment variables");
    }
    return url;
  }

  get redisHost(): string {
    const host = this.configService.get<string>("REDIS_HOST");
    if (!host) {
      throw new Error("REDIS_HOST is not defined in environment variables");
    }
    return host;
  }

  get redisPort(): number {
    const port = this.configService.get<number>("REDIS_PORT");
    if (!port) {
      throw new Error("REDIS_PORT is not defined in environment variables");
    }
    return port;
  }

  get jwtSecret(): string {
    const secret = this.configService.get<string>("JWT_SECRET");
    if (!secret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }
    return secret;
  }

  get jwtExpiration(): string {
    return this.configService.get<string>("JWT_EXPIRATION") || "1h";
  }

  get<T>(key: string, defaultValue?: T): T {
    const value = this.configService.get<T>(key);
    return value !== undefined ? value : (defaultValue as T);
  }
}
