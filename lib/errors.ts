// lib/errors.ts — AppError class: code, message, statusCode, context

type ErrorCode =
  | "VALIDATION_ERROR"
  | "AUTHENTICATION_ERROR"
  | "AUTHORIZATION_ERROR"
  | "CONFLICT_ERROR"
  | "RATE_LIMIT_EXCEEDED"
  | "GENERATION_FAILED"
  | "WEBHOOK_VERIFICATION_FAILED"
  | "PAYMENT_ERROR"
  | "INTERNAL_ERROR";

interface ErrorContext {
  readonly [key: string]: unknown;
}

interface AppErrorOptions {
  readonly code: ErrorCode;
  readonly message: string;
  readonly statusCode: number;
  readonly context?: ErrorContext;
}

const CLIENT_SAFE_MESSAGES: Record<ErrorCode, string> = {
  VALIDATION_ERROR: "Invalid input provided. Please check your data and try again.",
  AUTHENTICATION_ERROR: "Authentication required. Please sign in to continue.",
  AUTHORIZATION_ERROR: "You do not have access to this feature. Please upgrade your plan.",
  CONFLICT_ERROR: "This action conflicts with your current account state.",
  RATE_LIMIT_EXCEEDED: "Free tier limit reached. Please try again later or upgrade to Pro.",
  GENERATION_FAILED: "Prompt generation failed. Please try again.",
  WEBHOOK_VERIFICATION_FAILED: "Payment verification failed.",
  PAYMENT_ERROR: "Payment processing error. Please try again.",
  INTERNAL_ERROR: "An unexpected error occurred. Please try again later.",
} satisfies Record<ErrorCode, string>;

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly statusCode: number;
  readonly context: ErrorContext;

  constructor(options: AppErrorOptions) {
    super(options.message);
    this.name = "AppError";
    this.code = options.code;
    this.statusCode = options.statusCode;
    this.context = options.context ?? {};

    Object.setPrototypeOf(this, AppError.prototype);
  }

  toClientResponse(): { error: string; code: ErrorCode } {
    return {
      error: CLIENT_SAFE_MESSAGES[this.code],
      code: this.code,
    };
  }

  static validation(message: string, context?: ErrorContext): AppError {
    return new AppError({
      code: "VALIDATION_ERROR",
      message,
      statusCode: 400,
      context,
    });
  }

  static authentication(message: string, context?: ErrorContext): AppError {
    return new AppError({
      code: "AUTHENTICATION_ERROR",
      message,
      statusCode: 401,
      context,
    });
  }

  static authorization(message: string, context?: ErrorContext): AppError {
    return new AppError({
      code: "AUTHORIZATION_ERROR",
      message,
      statusCode: 403,
      context,
    });
  }

  static conflict(message: string, context?: ErrorContext): AppError {
    return new AppError({
      code: "CONFLICT_ERROR",
      message,
      statusCode: 409,
      context,
    });
  }

  static rateLimit(message: string, context?: ErrorContext): AppError {
    return new AppError({
      code: "RATE_LIMIT_EXCEEDED",
      message,
      statusCode: 429,
      context,
    });
  }

  static generationFailed(message: string, context?: ErrorContext): AppError {
    return new AppError({
      code: "GENERATION_FAILED",
      message,
      statusCode: 502,
      context,
    });
  }

  static webhookVerificationFailed(message: string, context?: ErrorContext): AppError {
    return new AppError({
      code: "WEBHOOK_VERIFICATION_FAILED",
      message,
      statusCode: 400,
      context,
    });
  }

  static paymentError(message: string, context?: ErrorContext): AppError {
    return new AppError({
      code: "PAYMENT_ERROR",
      message,
      statusCode: 402,
      context,
    });
  }

  static internal(message: string, context?: ErrorContext): AppError {
    return new AppError({
      code: "INTERNAL_ERROR",
      message,
      statusCode: 500,
      context,
    });
  }

  static isAppError(error: unknown): error is AppError {
    return error instanceof AppError;
  }
}
