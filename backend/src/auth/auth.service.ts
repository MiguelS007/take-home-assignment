import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { PrismaService } from "../prisma/prisma.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { LoggingService } from "../logging/logging.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
    private logger: LoggingService
  ) {
    this.logger.setContext("AuthService");
  }

  async login(loginDto: LoginDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: loginDto.email },
      });

      if (!user) {
        this.logger.warn(`Login attempt failed: Email not found`, {
          email: loginDto.email,
        });
        throw new UnauthorizedException("Invalid credentials");
      }

      const isPasswordValid = await bcrypt.compare(
        loginDto.password,
        user.password
      );

      if (!isPasswordValid) {
        this.logger.warn(`Login attempt failed: Invalid password`, {
          email: loginDto.email,
        });
        throw new UnauthorizedException("Invalid credentials");
      }

      if (!user.active) {
        this.logger.warn(`Login attempt failed: User is inactive`, {
          email: loginDto.email,
          userId: user.id,
        });
        throw new UnauthorizedException("User is inactive");
      }

      this.logger.log(`User logged in successfully`, { userId: user.id });
      return this.generateToken(user);
    } catch (error) {
      this.logger.error(`Login error: ${error.message}`, error.stack);
      throw error;
    }
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: registerDto.name,
        email: registerDto.email,
        password: hashedPassword,
        active: true,
      },
    });

    const { password, ...result } = user;
    return this.generateToken(user);
  }

  private generateToken(user: any) {
    const payload = { email: user.email, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      return payload;
    } catch (error) {
      throw new BadRequestException("Invalid token");
    }
  }

  async validateUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user || !user.active) {
      return null;
    }

    const { password, ...result } = user;
    return result;
  }
}
