import { Controller } from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from '../common/dto/create-attendance.dto';

@Controller()
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @MessagePattern({ cmd: 'create_attendance' })
  async create(data: {
    employeeId: number;
    createAttendanceDto: CreateAttendanceDto;
  }) {
    try {
      return await this.attendanceService.create(
        data.employeeId,
        data.createAttendanceDto,
      );
    } catch (error) {
      throw new RpcException({
        statusCode: this.getStatusCode(error),
        message: this.getErrorMessage(error),
        error: this.getErrorName(error),
      });
    }
  }

  @MessagePattern({ cmd: 'get_all_attendance' })
  async findAll() {
    try {
      return await this.attendanceService.findAll();
    } catch (error) {
      throw new RpcException({
        statusCode: this.getStatusCode(error),
        message: this.getErrorMessage(error),
        error: this.getErrorName(error),
      });
    }
  }

  @MessagePattern({ cmd: 'get_employee_attendance' })
  async findByEmployee(data: { employeeId: number }) {
    try {
      return await this.attendanceService.findByEmployee(data.employeeId);
    } catch (error) {
      throw new RpcException({
        statusCode: this.getStatusCode(error),
        message: this.getErrorMessage(error),
        error: this.getErrorName(error),
      });
    }
  }

  @MessagePattern({ cmd: 'get_attendance' })
  async findOne(data: { id: number }) {
    try {
      return await this.attendanceService.findOne(data.id);
    } catch (error) {
      throw new RpcException({
        statusCode: this.getStatusCode(error),
        message: this.getErrorMessage(error),
        error: this.getErrorName(error),
      });
    }
  }

  private getStatusCode(error: unknown): number {
    if (typeof error === 'object' && error !== null && 'status' in error) {
      return typeof error.status === 'number' ? error.status : 500;
    }
    return 500;
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === 'object' && error !== null && 'message' in error) {
      return typeof error.message === 'string'
        ? error.message
        : 'Internal server error';
    }
    return 'Internal server error';
  }

  private getErrorName(error: unknown): string {
    if (error instanceof Error) {
      return error.name;
    }
    if (typeof error === 'object' && error !== null && 'name' in error) {
      return typeof error.name === 'string' ? error.name : 'Error';
    }
    return 'Error';
  }
}
