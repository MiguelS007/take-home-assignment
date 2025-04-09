import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { PrismaService } from "../prisma/prisma.service";
import { LoggingService } from "../logging/logging.service";
import {
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";

jest.mock("bcrypt");

describe("AuthService", () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let prismaService: PrismaService;
  let loggingService: LoggingService;

  const mockUsersService = {
    findOne: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockLoggingService = {
    setContext: jest.fn(),
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: LoggingService, useValue: mockLoggingService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    prismaService = module.get<PrismaService>(PrismaService);
    loggingService = module.get<LoggingService>(LoggingService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("login", () => {
    const loginDto = {
      email: "test@example.com",
      password: "password123",
    };

    const user = {
      id: "1",
      name: "Test User",
      email: "test@example.com",
      password: "hashed_password",
      active: true,
    };

    it("should successfully login a user with valid credentials", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue("jwt_token");

      const result = await service.login(loginDto);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        user.password
      );
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        email: user.email,
        sub: user.id,
      });
      expect(result).toEqual({
        access_token: "jwt_token",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
      expect(mockLoggingService.log).toHaveBeenCalledWith(
        "User logged in successfully",
        { userId: user.id }
      );
    });

    it("should throw UnauthorizedException if user is not found", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException
      );
      expect(mockLoggingService.warn).toHaveBeenCalledWith(
        "Login attempt failed: Email not found",
        {
          email: loginDto.email,
        }
      );
    });

    it("should throw UnauthorizedException if password is invalid", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException
      );
      expect(mockLoggingService.warn).toHaveBeenCalledWith(
        "Login attempt failed: Invalid password",
        {
          email: loginDto.email,
        }
      );
    });

    it("should throw UnauthorizedException if user is inactive", async () => {
      const inactiveUser = { ...user, active: false };
      mockPrismaService.user.findUnique.mockResolvedValue(inactiveUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException
      );
      expect(mockLoggingService.warn).toHaveBeenCalledWith(
        "Login attempt failed: User is inactive",
        {
          email: loginDto.email,
          userId: inactiveUser.id,
        }
      );
    });

    it("should log error if login fails", async () => {
      const error = new Error("Database error");
      mockPrismaService.user.findUnique.mockRejectedValue(error);

      await expect(service.login(loginDto)).rejects.toThrow(error);
      expect(mockLoggingService.error).toHaveBeenCalledWith(
        `Login error: ${error.message}`,
        error.stack
      );
    });
  });

  describe("register", () => {
    const registerDto = {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    };

    const user = {
      id: "1",
      name: "Test User",
      email: "test@example.com",
      password: "hashed_password",
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it("should register a new user successfully", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashed_password");
      mockPrismaService.user.create.mockResolvedValue(user);
      mockJwtService.sign.mockReturnValue("jwt_token");

      const result = await service.register(registerDto);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          name: registerDto.name,
          email: registerDto.email,
          password: "hashed_password",
          active: true,
        },
      });
      expect(result).toEqual({
        access_token: "jwt_token",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    });

    it("should throw ConflictException if email is already registered", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(user);

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException
      );
    });
  });

  describe("validateToken", () => {
    it("should validate a token successfully", async () => {
      const payload = { email: "test@example.com", sub: "1" };
      mockJwtService.verify.mockReturnValue(payload);

      const result = await service.validateToken("valid_token");

      expect(mockJwtService.verify).toHaveBeenCalledWith("valid_token");
      expect(result).toEqual(payload);
    });

    it("should throw BadRequestException if token is invalid", async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error("Invalid token");
      });

      await expect(service.validateToken("invalid_token")).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe("validateUserById", () => {
    it("should validate a user by ID successfully", async () => {
      const user = {
        id: "1",
        name: "Test User",
        email: "test@example.com",
        password: "hashed_password",
        active: true,
      };

      mockPrismaService.user.findUnique.mockResolvedValue(user);

      const result = await service.validateUserById("1");

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: "1" },
      });
      expect(result).toEqual({
        id: "1",
        name: "Test User",
        email: "test@example.com",
        active: true,
      });
    });

    it("should return null if user is not found", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.validateUserById("1");

      expect(result).toBeNull();
    });

    it("should return null if user is inactive", async () => {
      const inactiveUser = {
        id: "1",
        name: "Test User",
        email: "test@example.com",
        password: "hashed_password",
        active: false,
      };

      mockPrismaService.user.findUnique.mockResolvedValue(inactiveUser);

      const result = await service.validateUserById("1");

      expect(result).toBeNull();
    });
  });
});
