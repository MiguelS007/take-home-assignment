import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { UnauthorizedException, ConflictException } from "@nestjs/common";

describe("AuthController", () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("login", () => {
    const loginDto: LoginDto = {
      email: "test@example.com",
      password: "password123",
    };

    const loginResponse = {
      access_token: "jwt_token",
      user: {
        id: "1",
        name: "Test User",
        email: "test@example.com",
      },
    };

    it("should login successfully with valid credentials", async () => {
      mockAuthService.login.mockResolvedValue(loginResponse);

      const result = await controller.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(loginResponse);
    });

    it("should pass through exceptions from the auth service", async () => {
      mockAuthService.login.mockRejectedValue(
        new UnauthorizedException("Invalid credentials")
      );

      await expect(controller.login(loginDto)).rejects.toThrow(
        UnauthorizedException
      );
    });
  });

  describe("register", () => {
    const registerDto: RegisterDto = {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    };

    const registerResponse = {
      access_token: "jwt_token",
      user: {
        id: "1",
        name: "Test User",
        email: "test@example.com",
      },
    };

    it("should register a new user successfully", async () => {
      mockAuthService.register.mockResolvedValue(registerResponse);

      const result = await controller.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(registerResponse);
    });

    it("should pass through exceptions from the auth service", async () => {
      mockAuthService.register.mockRejectedValue(
        new ConflictException("Email already registered")
      );

      await expect(controller.register(registerDto)).rejects.toThrow(
        ConflictException
      );
    });
  });

  describe("getProfile", () => {
    it("should return the user profile from request object", () => {
      const req = {
        user: {
          id: "1",
          name: "Test User",
          email: "test@example.com",
        },
      };

      const result = controller.getProfile(req as any);

      expect(result).toEqual({ user: req.user });
    });
  });
});
