import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { LoggerService } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const logger = app.get<LoggerService>(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.useGlobalFilters(
    new HttpExceptionFilter(logger),
    new AllExceptionsFilter(logger),
  );

  app.useGlobalInterceptors(new LoggingInterceptor(logger));

  app.enableCors();

  const authPort = configService.get<number>('AUTH_PORT') || 3001;
  const employeePort = configService.get<number>('EMPLOYEE_PORT') || 3002;
  const attendancePort = configService.get<number>('ATTENDANCE_PORT') || 3003;
  const uploadPort = configService.get<number>('UPLOAD_PORT') || 3004;

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: { host: 'localhost', port: authPort },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: { host: 'localhost', port: employeePort },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: { host: 'localhost', port: attendancePort },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: { host: 'localhost', port: uploadPort },
  });

  await app.startAllMicroservices();

  const bffPort = configService.get<number>('BFF_PORT') || 3000;
  await app.listen(bffPort);

  logger.log(`BFF Gateway is running on: http://localhost:${bffPort}`);
  logger.log(`Auth Service TCP on port: ${authPort}`);
  logger.log(`Employee Service TCP on port: ${employeePort}`);
  logger.log(`Attendance Service TCP on port: ${attendancePort}`);
  logger.log(`Upload Service TCP on port: ${uploadPort}`);
}

void bootstrap();
