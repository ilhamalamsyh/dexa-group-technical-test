import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../common/entities/user.entity';
import { LoginDto } from '../common/dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    try {
      console.log('[AUTH] Login attempt for email:', loginDto.email);

      const user = await this.userRepository.findOne({
        where: { email: loginDto.email },
        relations: ['employee'],
      });

      console.log('[AUTH] User found:', user ? 'Yes' : 'No');

      if (!user) {
        console.log('[AUTH] User not found, throwing UnauthorizedException');
        throw new UnauthorizedException('Invalid credentials');
      }

      console.log('[AUTH] Comparing password...');
      const isPasswordValid = await bcrypt.compare(
        loginDto.password,
        user.password,
      );

      console.log('[AUTH] Password valid:', isPasswordValid);

      if (!isPasswordValid) {
        console.log('[AUTH] Invalid password, throwing UnauthorizedException');
        throw new UnauthorizedException('Invalid credentials');
      }

      console.log('[AUTH] Creating JWT payload...');
      const payload = {
        sub: user.id,
        email: user.email,
        role: user.role,
        employeeId: user.employee?.id,
      };

      console.log('[AUTH] Payload:', JSON.stringify(payload, null, 2));

      console.log('[AUTH] Signing JWT token...');
      const token = this.jwtService.sign(payload);
      console.log('[AUTH] Token generated successfully');

      const response = {
        access_token: token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          employeeId: user.employee?.id,
        },
      };

      console.log('[AUTH] Login successful, returning response');
      return response;
    } catch (error) {
      console.error('[AUTH] Login error:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      console.error('[AUTH] Error message:', errorMessage);
      if (error instanceof Error) {
        console.error('[AUTH] Error stack:', error.stack);
      }
      throw error;
    }
  }

  async validateUser(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['employee'],
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      employeeId: user.employee?.id,
    };
  }
}
