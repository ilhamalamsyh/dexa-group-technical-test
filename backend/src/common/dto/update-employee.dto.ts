import {
  IsString,
  IsOptional,
  IsDateString,
  IsBoolean,
  IsEmail,
  MinLength,
} from 'class-validator';

export class UpdateEmployeeDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsOptional()
  employeeCode?: string;

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
