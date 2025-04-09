import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { PrismaService } from "../prisma/prisma.service";
import { User } from "./entities/user.entity";
import { Inject } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { LoggingService } from "../logging/logging.service";

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private logger: LoggingService
  ) {
    this.logger.setContext("UsersService");
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      this.logger.log("Creating new user", { email: createUserDto.email });

      const user = await this.prisma.user.create({
        data: {
          ...createUserDto,
          active: true,
        },
      });

      await this.cacheManager.del("users");
      this.logger.log("User created successfully", { userId: user.id });
      return user;
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`, error.stack, {
        email: createUserDto.email,
      });
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    const cachedUsers = await this.cacheManager.get<User[]>("users");

    if (cachedUsers) {
      return cachedUsers;
    }

    const users = await this.prisma.user.findMany({
      orderBy: {
        name: "asc",
      },
    });

    await this.cacheManager.set("users", users);
    return users;
  }

  async findOne(id: string): Promise<User> {
    const cachedUser = await this.cacheManager.get<User>(`user-${id}`);

    if (cachedUser) {
      return cachedUser;
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.cacheManager.set(`user-${id}`, user);
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    await this.findOne(id);

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });

    await this.cacheManager.del(`user-${id}`);
    await this.cacheManager.del("users");

    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    await this.prisma.user.delete({
      where: { id },
    });

    await this.cacheManager.del(`user-${id}`);
    await this.cacheManager.del("users");
  }
}
