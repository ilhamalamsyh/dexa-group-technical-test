import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Employee } from './employee.entity';

@Entity('attendance_records')
export class AttendanceRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'employee_id' })
  employeeId: number;

  @ManyToOne(() => Employee, (employee) => employee.attendanceRecords)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ name: 'attendance_date', type: 'date' })
  attendanceDate: Date;

  @Column({ name: 'check_in_time', type: 'timestamp' })
  checkInTime: Date;

  @Column({ name: 'photo_url', nullable: true })
  photoUrl: string;

  @Column({ nullable: true, type: 'text' })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
