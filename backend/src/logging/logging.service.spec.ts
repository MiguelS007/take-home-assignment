import { Test, TestingModule } from "@nestjs/testing";
import { LoggingService } from "./logging.service";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";

describe("LoggingService", () => {
  let module: TestingModule;
  let service: LoggingService;

  const mockLogger = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    verbose: jest.fn(),
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        LoggingService,
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: mockLogger,
        },
      ],
    }).compile();

    // Use resolve() instead of get() for transient-scoped providers
    service = await module.resolve(LoggingService);

    // Reset mock calls between tests
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should set context", () => {
    const context = "TestContext";
    service.setContext(context);

    service.log("Test message");
    expect(mockLogger.info).toHaveBeenCalledWith("Test message", { context });
  });

  it("should log info message with context and metadata", () => {
    const context = "TestContext";
    const message = "Test info message";
    const meta = { userId: "123" };

    service.setContext(context);
    service.log(message, meta);

    expect(mockLogger.info).toHaveBeenCalledWith(message, { context, ...meta });
  });

  it("should log error message with context, trace and metadata", async () => {
    // Create a new instance for each test to avoid context contamination
    const errorService = await module.resolve(LoggingService);

    const context = "TestContext";
    const message = "Test error message";
    const trace = "Error stack trace";
    const meta = { userId: "123" };

    errorService.setContext(context);
    errorService.error(message, trace, meta);

    expect(mockLogger.error).toHaveBeenCalledWith(message, {
      context,
      trace,
      ...meta,
    });
  });

  it("should log warning message with context and metadata", async () => {
    // Create a new instance for each test
    const warnService = await module.resolve(LoggingService);

    const context = "TestContext";
    const message = "Test warning message";
    const meta = { userId: "123" };

    warnService.setContext(context);
    warnService.warn(message, meta);

    expect(mockLogger.warn).toHaveBeenCalledWith(message, { context, ...meta });
  });

  it("should log debug message with context and metadata", async () => {
    // Create a new instance for each test
    const debugService = await module.resolve(LoggingService);

    const context = "TestContext";
    const message = "Test debug message";
    const meta = { userId: "123" };

    debugService.setContext(context);
    debugService.debug(message, meta);

    expect(mockLogger.debug).toHaveBeenCalledWith(message, {
      context,
      ...meta,
    });
  });

  it("should log verbose message with context and metadata", async () => {
    // Create a new instance for each test
    const verboseService = await module.resolve(LoggingService);

    const context = "TestContext";
    const message = "Test verbose message";
    const meta = { userId: "123" };

    verboseService.setContext(context);
    verboseService.verbose(message, meta);

    expect(mockLogger.verbose).toHaveBeenCalledWith(message, {
      context,
      ...meta,
    });
  });
});
