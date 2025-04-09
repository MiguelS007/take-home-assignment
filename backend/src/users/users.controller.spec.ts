import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { NotFoundException } from "@nestjs/common";

describe("UsersController", () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
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
        name: "Test User",
        email: "test@example.com",
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.create.mockResolvedValue(user);

      expect(await controller.create(createUserDto)).toEqual(user);
      expect(service.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe("findAll", () => {
    it("should return an array of users", async () => {
      const users = [
        { id: "1", name: "Test User", email: "test@example.com" },
        { id: "2", name: "Test User 2", email: "test2@example.com" },
      ];

      mockUsersService.findAll.mockResolvedValue(users);

      expect(await controller.findAll()).toEqual(users);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe("findOne", () => {
    it("should return a single user", async () => {
      const user = { id: "1", name: "Test User", email: "test@example.com" };

      mockUsersService.findOne.mockResolvedValue(user);

      expect(await controller.findOne("1")).toEqual(user);
      expect(service.findOne).toHaveBeenCalledWith("1");
    });

    it("should throw NotFoundException if user not found", async () => {
      mockUsersService.findOne.mockRejectedValue(
        new NotFoundException("User not found")
      );

      await expect(controller.findOne("999")).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe("update", () => {
    it("should update a user", async () => {
      const updateUserDto: UpdateUserDto = { name: "Updated Name" };
      const updatedUser = {
        id: "1",
        name: "Updated Name",
        email: "test@example.com",
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.update.mockResolvedValue(updatedUser);

      expect(await controller.update("1", updateUserDto)).toEqual(updatedUser);
      expect(service.update).toHaveBeenCalledWith("1", updateUserDto);
    });
  });

  describe("remove", () => {
    it("should remove a user", async () => {
      mockUsersService.remove.mockResolvedValue(undefined);

      expect(await controller.remove("1")).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith("1");
    });
  });
});
