import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { Employee } from './employee.entity';

export enum UserRole {
  EMPLOYEE = 'EMPLOYEE',
  HR_ADMIN = 'HR_ADMIN',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'varchar',
    enum: UserRole,
  })
  role: UserRole;

  @OneToOne(() => Employee, (employee) => employee.user)
  employee: Employee;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
