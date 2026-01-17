import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { LoginDto } from '../common/dto/login.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'login' })
  async login(loginDto: LoginDto) {
    console.log('[AUTH-CONTROLLER] Received TCP message: login');
    console.log('[AUTH-CONTROLLER] Data:', { email: loginDto.email });

    try {
      const result = await this.authService.login(loginDto);
      console.log('[AUTH-CONTROLLER] Returning result to BFF');
      return result;
    } catch (error) {
      console.error('[AUTH-CONTROLLER] Error occurred:', error);
      throw error;
    }
  }

  @MessagePattern({ cmd: 'validate_user' })
  async validateUser(data: { userId: number }) {
    return this.authService.validateUser(data.userId);
  }
}
