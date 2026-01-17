import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { AttendanceRecord } from '../common/entities/attendance-record.entity';
import { Employee } from '../common/entities/employee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AttendanceRecord, Employee])],
  controllers: [AttendanceController],
  providers: [AttendanceService],
})
export class AttendanceModule {}
