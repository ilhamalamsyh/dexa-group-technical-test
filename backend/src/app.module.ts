import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './common/logger/winston.config';
import { BffModule } from './bff-svc/bff.module';
import { AuthModule } from './auth-svc/auth.module';
import { EmployeeModule } from './employee-svc/employee.module';
import { AttendanceModule } from './attendance-svc/attendance.module';
import { UploadModule } from './upload-svc/upload.module';
import { User } from './common/entities/user.entity';
import { Employee } from './common/entities/employee.entity';
import { AttendanceRecord } from './common/entities/attendance-record.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    WinstonModule.forRoot(winstonConfig),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [User, Employee, AttendanceRecord],
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    BffModule,
    AuthModule,
    EmployeeModule,
    AttendanceModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
