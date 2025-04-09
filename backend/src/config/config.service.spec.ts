import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "./config.service";
import { ConfigService as NestConfigService } from "@nestjs/config";

describe("ConfigService", () => {
  let service: ConfigService;
  let nestConfigService: NestConfigService;

  const mockNestConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        {
          provide: NestConfigService,
          useValue: mockNestConfigService,
        },
      ],
    }).compile();

    service = module.get<ConfigService>(ConfigService);
    nestConfigService = module.get<NestConfigService>(NestConfigService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("isProduction", () => {
    it("should return true when NODE_ENV is production", () => {
      jest.spyOn(mockNestConfigService, "get").mockReturnValue("production");
      expect(service.isProduction).toBe(true);
    });

    it("should return false when NODE_ENV is not production", () => {
      jest.spyOn(mockNestConfigService, "get").mockReturnValue("development");
      expect(service.isProduction).toBe(false);
    });
  });

  describe("isDevelopment", () => {
    it("should return true when NODE_ENV is development", () => {
      jest.spyOn(mockNestConfigService, "get").mockReturnValue("development");
      expect(service.isDevelopment).toBe(true);
    });

    it("should return false when NODE_ENV is not development", () => {
      jest.spyOn(mockNestConfigService, "get").mockReturnValue("production");
      expect(service.isDevelopment).toBe(false);
    });
  });

  describe("isTest", () => {
    it("should return true when NODE_ENV is test", () => {
      jest.spyOn(mockNestConfigService, "get").mockReturnValue("test");
      expect(service.isTest).toBe(true);
    });

    it("should return false when NODE_ENV is not test", () => {
      jest.spyOn(mockNestConfigService, "get").mockReturnValue("development");
      expect(service.isTest).toBe(false);
    });
  });

  describe("nodeEnv", () => {
    it("should return the value from ConfigService", () => {
      jest.spyOn(mockNestConfigService, "get").mockReturnValue("test");
      expect(service.nodeEnv).toBe("test");
    });

    it("should default to development if not defined", () => {
      jest.spyOn(mockNestConfigService, "get").mockReturnValue(undefined);
      expect(service.nodeEnv).toBe("development");
    });
  });

  describe("port", () => {
    it("should return the port number from ConfigService", () => {
      jest.spyOn(mockNestConfigService, "get").mockReturnValue(4000);
      expect(service.port).toBe(4000);
    });

    it("should default to 3001 if not defined", () => {
      jest.spyOn(mockNestConfigService, "get").mockReturnValue(undefined);
      expect(service.port).toBe(3001);
    });
  });

  describe("databaseUrl", () => {
    it("should return the database URL from ConfigService", () => {
      const dbUrl = "postgresql://user:pass@localhost:5432/db";
      jest.spyOn(mockNestConfigService, "get").mockReturnValue(dbUrl);
      expect(service.databaseUrl).toBe(dbUrl);
    });

    it("should throw error if database URL is not defined", () => {
      jest.spyOn(mockNestConfigService, "get").mockReturnValue(undefined);
      expect(() => service.databaseUrl).toThrow(
        "DATABASE_URL is not defined in environment variables"
      );
    });
  });

  describe("redisHost", () => {
    it("should return the Redis host from ConfigService", () => {
      const host = "localhost";
      jest.spyOn(mockNestConfigService, "get").mockReturnValue(host);
      expect(service.redisHost).toBe(host);
    });

    it("should throw error if Redis host is not defined", () => {
      jest.spyOn(mockNestConfigService, "get").mockReturnValue(undefined);
      expect(() => service.redisHost).toThrow(
        "REDIS_HOST is not defined in environment variables"
      );
    });
  });

  describe("redisPort", () => {
    it("should return the Redis port from ConfigService", () => {
      const port = 6379;
      jest.spyOn(mockNestConfigService, "get").mockReturnValue(port);
      expect(service.redisPort).toBe(port);
    });

    it("should throw error if Redis port is not defined", () => {
      jest.spyOn(mockNestConfigService, "get").mockReturnValue(undefined);
      expect(() => service.redisPort).toThrow(
        "REDIS_PORT is not defined in environment variables"
      );
    });
  });

  describe("jwtSecret", () => {
    it("should return the JWT secret from ConfigService", () => {
      const secret = "test-secret";
      jest.spyOn(mockNestConfigService, "get").mockReturnValue(secret);
      expect(service.jwtSecret).toBe(secret);
    });

    it("should throw error if JWT secret is not defined", () => {
      jest.spyOn(mockNestConfigService, "get").mockReturnValue(undefined);
      expect(() => service.jwtSecret).toThrow(
        "JWT_SECRET is not defined in environment variables"
      );
    });
  });

  describe("jwtExpiration", () => {
    it("should return the JWT expiration from ConfigService", () => {
      const expiration = "2h";
      jest.spyOn(mockNestConfigService, "get").mockReturnValue(expiration);
      expect(service.jwtExpiration).toBe(expiration);
    });

    it("should default to 1h if not defined", () => {
      jest.spyOn(mockNestConfigService, "get").mockReturnValue(undefined);
      expect(service.jwtExpiration).toBe("1h");
    });
  });

  describe("get", () => {
    it("should return the value from ConfigService", () => {
      const value = "test-value";
      jest.spyOn(mockNestConfigService, "get").mockReturnValue(value);
      expect(service.get("TEST_KEY")).toBe(value);
    });

    it("should return the default value if key is not found", () => {
      const defaultValue = "default-value";
      jest.spyOn(mockNestConfigService, "get").mockReturnValue(undefined);
      expect(service.get("MISSING_KEY", defaultValue)).toBe(defaultValue);
    });
  });
});
