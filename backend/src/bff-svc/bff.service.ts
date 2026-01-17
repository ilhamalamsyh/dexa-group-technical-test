import {
  Injectable,
  Inject,
  OnModuleInit,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { LoginDto } from '../common/dto/login.dto';
import { CreateEmployeeDto } from '../common/dto/create-employee.dto';
import { UpdateEmployeeDto } from '../common/dto/update-employee.dto';
import { CreateAttendanceDto } from '../common/dto/create-attendance.dto';

@Injectable()
export class BffService implements OnModuleInit {
  constructor(
    @Inject('AUTH_SERVICE') private authClient: ClientProxy,
    @Inject('EMPLOYEE_SERVICE') private employeeClient: ClientProxy,
    @Inject('ATTENDANCE_SERVICE') private attendanceClient: ClientProxy,
    @Inject('UPLOAD_SERVICE') private uploadClient: ClientProxy,
  ) {}

  async onModuleInit() {
    await this.authClient.connect();
    await this.employeeClient.connect();
    await this.attendanceClient.connect();
    await this.uploadClient.connect();
  }

  async login(loginDto: LoginDto): Promise<any> {
    console.log('[BFF-SERVICE] Sending login request to Auth Service via TCP');
    console.log('[BFF-SERVICE] Login data:', { email: loginDto.email });

    try {
      const result: { accessToken: string; user: any } = await firstValueFrom(
        this.authClient.send<{ accessToken: string; user: any }>(
          { cmd: 'login' },
          loginDto,
        ),
      );

      console.log('[BFF-SERVICE] Received response from Auth Service');
      return result;
    } catch (error) {
      console.error('[BFF-SERVICE] Login error:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      console.error('[BFF-SERVICE] Error message:', errorMessage);
      throw error;
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<any> {
    const fileData = {
      buffer: file.buffer,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    };
    return firstValueFrom(
      this.uploadClient.send({ cmd: 'upload_file' }, fileData),
    );
  }

  async createEmployee(createEmployeeDto: CreateEmployeeDto): Promise<any> {
    return firstValueFrom(
      this.employeeClient.send({ cmd: 'create_employee' }, createEmployeeDto),
    );
  }

  async getAllEmployees(): Promise<any> {
    return firstValueFrom(
      this.employeeClient.send({ cmd: 'get_all_employees' }, {}),
    );
  }

  async getEmployee(id: number): Promise<any> {
    return firstValueFrom(
      this.employeeClient.send({ cmd: 'get_employee' }, { id }),
    );
  }

  async updateEmployee(
    id: number,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<any> {
    return firstValueFrom(
      this.employeeClient.send(
        { cmd: 'update_employee' },
        { id, updateEmployeeDto },
      ),
    );
  }

  async deleteEmployee(id: number): Promise<any> {
    return firstValueFrom(
      this.employeeClient.send({ cmd: 'delete_employee' }, { id }),
    );
  }

  async createAttendance(
    employeeId: number,
    createAttendanceDto: CreateAttendanceDto,
  ): Promise<any> {
    try {
      return await firstValueFrom(
        this.attendanceClient.send(
          { cmd: 'create_attendance' },
          { employeeId, createAttendanceDto },
        ),
      );
    } catch (error: unknown) {
      console.log('[BFF-SERVICE] Caught error from attendance service:', error);

      if (this.isRpcError(error)) {
        const { statusCode, message } = error.error;
        console.log('[BFF-SERVICE] RPC Error details:', {
          statusCode,
          message,
        });
        const HttpExceptionClass =
          this.getHttpExceptionByStatusCode(statusCode);
        throw new HttpExceptionClass(message);
      }

      if (this.isDirectError(error)) {
        console.log('[BFF-SERVICE] Direct error:', error);
        const HttpExceptionClass = this.getHttpExceptionByStatusCode(
          error.statusCode,
        );
        throw new HttpExceptionClass(error.message);
      }

      console.log('[BFF-SERVICE] Unknown error structure, re-throwing');
      throw error;
    }
  }

  async getAllAttendance(): Promise<any> {
    return firstValueFrom(
      this.attendanceClient.send({ cmd: 'get_all_attendance' }, {}),
    );
  }

  async getEmployeeAttendance(employeeId: number): Promise<any> {
    return firstValueFrom(
      this.attendanceClient.send(
        { cmd: 'get_employee_attendance' },
        { employeeId },
      ),
    );
  }

  async getAttendance(id: number): Promise<any> {
    return firstValueFrom(
      this.attendanceClient.send({ cmd: 'get_attendance' }, { id }),
    );
  }

  private isRpcError(
    error: unknown,
  ): error is { error: { statusCode: number; message: string } } {
    return (
      typeof error === 'object' &&
      error !== null &&
      'error' in error &&
      typeof error.error === 'object' &&
      error.error !== null &&
      'statusCode' in error.error &&
      'message' in error.error &&
      typeof error.error.statusCode === 'number' &&
      typeof error.error.message === 'string'
    );
  }

  private isDirectError(
    error: unknown,
  ): error is { statusCode: number; message: string } {
    return (
      typeof error === 'object' &&
      error !== null &&
      'statusCode' in error &&
      'message' in error &&
      typeof error.statusCode === 'number' &&
      typeof error.message === 'string'
    );
  }

  private getHttpExceptionByStatusCode(
    statusCode: number,
  ): typeof BadRequestException {
    switch (statusCode) {
      case 400:
        return BadRequestException;
      case 401:
        return UnauthorizedException;
      case 403:
        return ForbiddenException;
      case 404:
        return NotFoundException;
      case 409:
        return ConflictException;
      default:
        return InternalServerErrorException;
    }
  }
}
