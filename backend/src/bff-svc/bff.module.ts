import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BffController } from './bff.controller';
import { BffService } from './bff.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    ClientsModule.registerAsync([
      {
        name: 'AUTH_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: 'localhost',
            port: configService.get<number>('AUTH_PORT'),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'EMPLOYEE_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: 'localhost',
            port: configService.get<number>('EMPLOYEE_PORT'),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'ATTENDANCE_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: 'localhost',
            port: configService.get<number>('ATTENDANCE_PORT'),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'UPLOAD_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: 'localhost',
            port: configService.get<number>('UPLOAD_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [BffController],
  providers: [BffService, JwtStrategy],
})
export class BffModule {}
