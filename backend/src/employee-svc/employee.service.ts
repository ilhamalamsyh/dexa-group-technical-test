import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Employee } from '../common/entities/employee.entity';
import { User, UserRole } from '../common/entities/user.entity';
import { CreateEmployeeDto } from '../common/dto/create-employee.dto';
import { UpdateEmployeeDto } from '../common/dto/update-employee.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: createEmployeeDto.email },
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const existingEmployee = await this.employeeRepository.findOne({
      where: { employeeCode: createEmployeeDto.employeeCode },
    });
    if (existingEmployee) {
      throw new ConflictException('Employee code already exists');
    }

    const hashedPassword = await bcrypt.hash(createEmployeeDto.password, 10);

    const user = this.userRepository.create({
      email: createEmployeeDto.email,
      password: hashedPassword,
      role: UserRole.EMPLOYEE,
    });
    const savedUser = await this.userRepository.save(user);

    const employee = this.employeeRepository.create({
      userId: savedUser.id,
      fullName: createEmployeeDto.fullName,
      employeeCode: createEmployeeDto.employeeCode,
      department: createEmployeeDto.department,
      position: createEmployeeDto.position,
      phone: createEmployeeDto.phone,
      hireDate: createEmployeeDto.hireDate
        ? new Date(createEmployeeDto.hireDate)
        : undefined,
      isActive: createEmployeeDto.isActive ?? true,
    });

    const savedEmployee = await this.employeeRepository.save(employee);
    return this.findOne(savedEmployee.id);
  }

  async findAll() {
    return this.employeeRepository.find({
      relations: ['user'],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number) {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const { user, ...employeeData } = employee;
    return {
      ...employeeData,
      email: user?.email,
    };
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    return await this.dataSource.transaction(async (manager) => {
      const employee = await manager.findOne(Employee, {
        where: { id },
        relations: ['user'],
      });

      if (!employee) {
        throw new NotFoundException('Employee not found');
      }

      if (
        updateEmployeeDto.email &&
        updateEmployeeDto.email !== employee.user?.email
      ) {
        const existingUser = await manager.findOne(User, {
          where: { email: updateEmployeeDto.email },
        });
        if (existingUser && existingUser.id !== employee.userId) {
          throw new ConflictException('Email already exists');
        }
      }

      if (
        updateEmployeeDto.employeeCode &&
        updateEmployeeDto.employeeCode !== employee.employeeCode
      ) {
        const existingEmployee = await manager.findOne(Employee, {
          where: { employeeCode: updateEmployeeDto.employeeCode },
        });
        if (existingEmployee && existingEmployee.id !== id) {
          throw new ConflictException('Employee code already exists');
        }
      }

      if (employee.user) {
        if (updateEmployeeDto.email) {
          employee.user.email = updateEmployeeDto.email;
        }

        if (updateEmployeeDto.password) {
          employee.user.password = await bcrypt.hash(
            updateEmployeeDto.password,
            10,
          );
        }

        await manager.save(User, employee.user);
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { email, password, ...employeeData } = updateEmployeeDto;

      Object.assign(employee, {
        ...employeeData,
        hireDate: updateEmployeeDto.hireDate
          ? new Date(updateEmployeeDto.hireDate)
          : employee.hireDate,
      });

      await manager.save(Employee, employee);

      const updatedEmployee = await manager.findOne(Employee, {
        where: { id },
        relations: ['user'],
      });

      if (!updatedEmployee) {
        throw new NotFoundException('Employee not found after update');
      }

      const { user, ...employeeResult } = updatedEmployee;
      return {
        ...employeeResult,
        email: user?.email || '',
      };
    });
  }

  async remove(id: number) {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    if (employee.user) {
      await this.userRepository.remove(employee.user);
    }

    await this.employeeRepository.remove(employee);
    return { message: 'Employee deleted successfully' };
  }
}
