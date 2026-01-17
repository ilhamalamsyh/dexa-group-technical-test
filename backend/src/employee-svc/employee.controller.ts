import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from '../common/dto/create-employee.dto';
import { UpdateEmployeeDto } from '../common/dto/update-employee.dto';

@Controller()
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @MessagePattern({ cmd: 'create_employee' })
  async create(createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createEmployeeDto);
  }

  @MessagePattern({ cmd: 'get_all_employees' })
  async findAll() {
    return this.employeeService.findAll();
  }

  @MessagePattern({ cmd: 'get_employee' })
  async findOne(data: { id: number }) {
    return this.employeeService.findOne(data.id);
  }

  @MessagePattern({ cmd: 'update_employee' })
  async update(data: { id: number; updateEmployeeDto: UpdateEmployeeDto }) {
    return this.employeeService.update(data.id, data.updateEmployeeDto);
  }

  @MessagePattern({ cmd: 'delete_employee' })
  async remove(data: { id: number }) {
    return this.employeeService.remove(data.id);
  }
}
