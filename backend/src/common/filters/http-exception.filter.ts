import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import type { LoggerService } from '@nestjs/common';
import { Request, Response } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

interface RequestWithUser extends Request {
  user?: {
    sub?: string;
  };
}

interface ExceptionResponse {
  message?: string;
  error?: string;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<RequestWithUser>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message:
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as ExceptionResponse).message ||
            exception.message,
      error:
        typeof exceptionResponse === 'object' &&
        (exceptionResponse as ExceptionResponse).error
          ? (exceptionResponse as ExceptionResponse).error
          : HttpStatus[status],
    };

    this.logger.error(
      `HTTP Exception: ${request.method} ${request.url}`,
      JSON.stringify({
        ...errorResponse,
        userId: request.user?.sub,
        stack: exception.stack,
      }),
    );

    response.status(status).json(errorResponse);
  }
}
