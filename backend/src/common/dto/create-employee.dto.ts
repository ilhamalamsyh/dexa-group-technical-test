import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEmail,
  IsDateString,
  IsBoolean,
} from 'class-validator';

export class CreateEmployeeDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  employeeCode: string;

  @IsString()
  @IsOptional()
  department?: string;

  @IsString()
  @IsOptional()
  position?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsDateString()
  @IsOptional()
  hireDate?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
