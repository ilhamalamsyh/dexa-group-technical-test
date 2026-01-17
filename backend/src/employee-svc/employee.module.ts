import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { Employee } from '../common/entities/employee.entity';
import { User } from '../common/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Employee, User])],
  controllers: [EmployeeController],
  providers: [EmployeeService],
})
export class EmployeeModule {}
