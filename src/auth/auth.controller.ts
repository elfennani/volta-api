import {
  BadRequestException,
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import {
  type SendVerificationCodeDto,
  sendVerificationCodeSchema,
} from './dto/send-verification-code.dto.js';
import { AuthService } from './auth.service.js';
import { differenceInSeconds } from 'date-fns';
import {
  type RegisterUserDto,
  registerUserSchema,
} from './dto/register-user.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('code')
  async sendVerificationCode(
    @Body({ schema: sendVerificationCodeSchema }) data: SendVerificationCodeDto,
  ) {
    const result = sendVerificationCodeSchema.safeParse(data);

    if (!result.success) {
      throw new BadRequestException({ message: 'Invalid Phone Number' });
    }

    const {
      data: { phone },
    } = result;

    const lastCodeCreated = await this.authService.getLastCodeTimestamp(phone);

    if (
      !!lastCodeCreated &&
      differenceInSeconds(Date.now(), lastCodeCreated) < 120
    ) {
      console.log('Too many verification code requests');
      throw new HttpException(
        { message: 'Try again in ~2 minutes' },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const code = await this.authService.createVerificationCode(phone);

    // NOTE: Remove in production
    console.log('Created verification code', code);
  }

  @Post('login')
  async login(@Body({ schema: registerUserSchema }) data: RegisterUserDto) {
    const result = registerUserSchema.safeParse(data);

    if (!result.success) {
      throw new BadRequestException({ message: 'Invalid phone or code' });
    }

    const { data: parsed } = result;

    const code = await this.authService.getVerificationCode(
      parsed.phone,
      parsed.code.toString(),
    );

    if (!code) {
      throw new BadRequestException({ message: 'Invalid phone or number' });
    }

    await this.authService.invalidateCode(code.id);

    return this.authService.login(parsed.phone);
  }
}
