import { IsString, IsOptional } from 'class-validator';

export class CreateAttendanceDto {
  @IsString()
  photoUrl: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
