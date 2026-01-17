import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AttendanceRecord } from '../common/entities/attendance-record.entity';
import { Employee } from '../common/entities/employee.entity';
import { CreateAttendanceDto } from '../common/dto/create-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(AttendanceRecord)
    private attendanceRepository: Repository<AttendanceRecord>,
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}

  async create(employeeId: number, createAttendanceDto: CreateAttendanceDto) {
    const employee = await this.employeeRepository.findOne({
      where: { id: employeeId },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingAttendance = await this.attendanceRepository.findOne({
      where: {
        employeeId,
        attendanceDate: today,
      },
    });

    if (existingAttendance) {
      throw new BadRequestException(
        'Hanya dapat melakukan absen 1 kali sehari.',
      );
    }

    const attendance = this.attendanceRepository.create({
      employeeId,
      attendanceDate: today,
      checkInTime: new Date(),
      photoUrl: createAttendanceDto.photoUrl,
      notes: createAttendanceDto.notes,
    });

    return this.attendanceRepository.save(attendance);
  }

  async findAll() {
    return this.attendanceRepository.find({
      relations: ['employee', 'employee.user'],
      order: { checkInTime: 'DESC' },
    });
  }

  async findByEmployee(employeeId: number) {
    return this.attendanceRepository.find({
      where: { employeeId },
      order: { checkInTime: 'DESC' },
    });
  }

  async findOne(id: number) {
    const attendance = await this.attendanceRepository.findOne({
      where: { id },
      relations: ['employee', 'employee.user'],
    });

    if (!attendance) {
      throw new NotFoundException('Attendance record not found');
    }

    return attendance;
  }
}
