import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import type { LoggerService } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Request, Response } from 'express';

interface RequestWithUser extends Request {
  user?: {
    sub?: string;
  };
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const method = request.method;
    const url = request.url;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const body = request.body;
    const headers = request.headers;
    const userId = request.user?.sub;
    const now = Date.now();

    this.logger.log(
      `Incoming Request: ${method} ${url}`,
      JSON.stringify({
        method,
        url,
        userId,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        body: this.sanitizeBody(body),
        userAgent: headers['user-agent'],
      }),
    );

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse<Response>();
          const { statusCode } = response;
          const responseTime = Date.now() - now;

          this.logger.log(
            `Outgoing Response: ${method} ${url} ${statusCode} - ${responseTime}ms`,
            JSON.stringify({
              method,
              url,
              statusCode,
              responseTime: `${responseTime}ms`,
              userId,
            }),
          );
        },
        error: (error: Error) => {
          const responseTime = Date.now() - now;

          this.logger.error(
            `Error Response: ${method} ${url} - ${responseTime}ms`,
            JSON.stringify({
              method,
              url,
              responseTime: `${responseTime}ms`,
              userId,
              error: error.message,
              stack: error.stack,
            }),
          );
        },
      }),
    );
  }

  private sanitizeBody(body: any): Record<string, any> {
    if (!body) return {};

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const sanitized: Record<string, any> = { ...body };
    const sensitiveFields = [
      'password',
      'token',
      'refreshToken',
      'accessToken',
    ];

    sensitiveFields.forEach((field) => {
      if (field in sanitized) {
        sanitized[field] = '***REDACTED***';
      }
    });

    return sanitized;
  }
}
