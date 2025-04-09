import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { PrismaService } from "../prisma/prisma.service";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { LoggingService } from "../logging/logging.service";

describe("UsersService", () => {
  let service: UsersService;
  let prismaService: PrismaService;
  let cacheManager: any;
  let loggingService: LoggingService;

  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  };

  const mockLoggingService = {
    setContext: jest.fn(),
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: CACHE_MANAGER, useValue: mockCacheManager },
        { provide: LoggingService, useValue: mockLoggingService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
    cacheManager = module.get(CACHE_MANAGER);
    loggingService = module.get<LoggingService>(LoggingService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should create a user", async () => {
      const createUserDto: CreateUserDto = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      };
      const user = {
        id: "1",
        ...createUserDto,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.create.mockResolvedValue(user);

      expect(await service.create(createUserDto)).toEqual(user);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: { ...createUserDto, active: true },
      });
      expect(mockCacheManager.del).toHaveBeenCalledWith("users");
      expect(mockLoggingService.log).toHaveBeenCalledTimes(2);
    });

    it("should throw and log error if creation fails", async () => {
      const createUserDto: CreateUserDto = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      };

      const error = new Error("Database error");
      mockPrismaService.user.create.mockRejectedValue(error);

      await expect(service.create(createUserDto)).rejects.toThrow(error);
      expect(mockLoggingService.error).toHaveBeenCalledWith(
        `Error creating user: ${error.message}`,
        error.stack,
        { email: createUserDto.email }
      );
    });
  });

  describe("findAll", () => {
    it("should return cached users if available", async () => {
      const users = [{ id: "1", name: "Test User", email: "test@example.com" }];
      mockCacheManager.get.mockResolvedValue(users);

      expect(await service.findAll()).toEqual(users);
      expect(mockCacheManager.get).toHaveBeenCalledWith("users");
      expect(mockPrismaService.user.findMany).not.toHaveBeenCalled();
    });

    it("should fetch and cache users if not cached", async () => {
      const users = [{ id: "1", name: "Test User", email: "test@example.com" }];
      mockCacheManager.get.mockResolvedValue(null);
      mockPrismaService.user.findMany.mockResolvedValue(users);

      expect(await service.findAll()).toEqual(users);
      expect(mockCacheManager.get).toHaveBeenCalledWith("users");
      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({
        orderBy: { name: "asc" },
      });
      expect(mockCacheManager.set).toHaveBeenCalledWith("users", users);
    });
  });

  describe("findOne", () => {
    it("should return cached user if available", async () => {
      const user = { id: "1", name: "Test User", email: "test@example.com" };
      mockCacheManager.get.mockResolvedValue(user);

      expect(await service.findOne("1")).toEqual(user);
      expect(mockCacheManager.get).toHaveBeenCalledWith("user-1");
      expect(mockPrismaService.user.findUnique).not.toHaveBeenCalled();
    });

    it("should fetch and cache user if not cached", async () => {
      const user = { id: "1", name: "Test User", email: "test@example.com" };
      mockCacheManager.get.mockResolvedValue(null);
      mockPrismaService.user.findUnique.mockResolvedValue(user);

      expect(await service.findOne("1")).toEqual(user);
      expect(mockCacheManager.get).toHaveBeenCalledWith("user-1");
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: "1" },
      });
      expect(mockCacheManager.set).toHaveBeenCalledWith("user-1", user);
    });

    it("should throw NotFoundException if user not found", async () => {
      mockCacheManager.get.mockResolvedValue(null);
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.findOne("1")).rejects.toThrow(NotFoundException);
    });
  });

  describe("update", () => {
    it("should update a user", async () => {
      const updateUserDto: UpdateUserDto = { name: "Updated Name" };
      const user = { id: "1", name: "Test User", email: "test@example.com" };
      const updatedUser = { ...user, ...updateUserDto };

      mockCacheManager.get.mockResolvedValue(null);
      mockPrismaService.user.findUnique.mockResolvedValue(user);
      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      expect(await service.update("1", updateUserDto)).toEqual(updatedUser);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: "1" },
        data: updateUserDto,
      });
      expect(mockCacheManager.del).toHaveBeenCalledWith("user-1");
      expect(mockCacheManager.del).toHaveBeenCalledWith("users");
    });
  });

  describe("remove", () => {
    it("should remove a user", async () => {
      const user = { id: "1", name: "Test User", email: "test@example.com" };

      mockCacheManager.get.mockResolvedValue(null);
      mockPrismaService.user.findUnique.mockResolvedValue(user);

      await service.remove("1");

      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
        where: { id: "1" },
      });
      expect(mockCacheManager.del).toHaveBeenCalledWith("user-1");
      expect(mockCacheManager.del).toHaveBeenCalledWith("users");
    });
  });
});
