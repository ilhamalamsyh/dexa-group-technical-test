import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BffService } from './bff.service';
import { LoginDto } from '../common/dto/login.dto';
import { CreateEmployeeDto } from '../common/dto/create-employee.dto';
import { UpdateEmployeeDto } from '../common/dto/update-employee.dto';
import { CreateAttendanceDto } from '../common/dto/create-attendance.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../common/entities/user.entity';
import type { RequestUser } from '../common/interfaces/jwt-payload.interface';

@Controller('api')
export class BffController {
  constructor(private readonly bffService: BffService) {}

  @Post('auth/login')
  async login(@Body() loginDto: LoginDto): Promise<any> {
    console.log('[BFF-CONTROLLER] POST /api/auth/login called');
    console.log('[BFF-CONTROLLER] Request body:', { email: loginDto.email });

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = await this.bffService.login(loginDto);
      console.log('[BFF-CONTROLLER] Login successful');
      return result;
    } catch (error) {
      console.error('[BFF-CONTROLLER] Login failed:', error);
      throw error;
    }
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<any> {
    return this.bffService.uploadFile(file);
  }

  @Post('employees')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HR_ADMIN)
  async createEmployee(
    @Body() createEmployeeDto: CreateEmployeeDto,
  ): Promise<any> {
    return this.bffService.createEmployee(createEmployeeDto);
  }

  @Get('employees')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HR_ADMIN)
  async getAllEmployees(): Promise<any> {
    return this.bffService.getAllEmployees();
  }

  @Get('employees/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HR_ADMIN)
  async getEmployee(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.bffService.getEmployee(id);
  }

  @Put('employees/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HR_ADMIN)
  async updateEmployee(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<any> {
    return this.bffService.updateEmployee(id, updateEmployeeDto);
  }

  @Delete('employees/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HR_ADMIN)
  async deleteEmployee(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.bffService.deleteEmployee(id);
  }

  @Post('attendance')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EMPLOYEE)
  async createAttendance(
    @CurrentUser() user: RequestUser,
    @Body() createAttendanceDto: CreateAttendanceDto,
  ): Promise<any> {
    return this.bffService.createAttendance(
      user.employeeId!,
      createAttendanceDto,
    );
  }

  @Get('attendance')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HR_ADMIN)
  async getAllAttendance(): Promise<any> {
    return this.bffService.getAllAttendance();
  }

  @Get('attendance/my')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EMPLOYEE)
  async getMyAttendance(@CurrentUser() user: RequestUser): Promise<any> {
    return this.bffService.getEmployeeAttendance(user.employeeId!);
  }

  @Get('attendance/:id')
  @UseGuards(JwtAuthGuard)
  async getAttendance(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.bffService.getAttendance(id);
  }
}
