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

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<RequestWithUser>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: message,
      error: HttpStatus[status],
    };

    this.logger.error(
      `Unhandled Exception: ${request.method} ${request.url}`,
      JSON.stringify({
        ...errorResponse,
        userId: request.user?.sub,
        stack: exception instanceof Error ? exception.stack : undefined,
        exception:
          exception instanceof Error ? exception.toString() : exception,
      }),
    );

    response.status(status).json(errorResponse);
  }
}
