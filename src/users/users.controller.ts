import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import type { AuthenticatedRequest } from '../auth/types/authenticated-request.js';
import { toUserResponseDto } from './mappers/user-response.mapper.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import {
  type SetupUserDetailsDto,
  setupUserDetailsSchema,
} from './dto/setup-user-details.dto.js';
import { JwtVerifiedAuthGuard } from '../auth/guards/jwt-verified-auth.guard.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getCurrentUser(@Req() req: AuthenticatedRequest) {
    return toUserResponseDto(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('setup')
  async setupUserDetails(
    @Req() req: AuthenticatedRequest,
    @Body({ schema: setupUserDetailsSchema }) data: SetupUserDetailsDto,
  ) {
    if (req.user.isActive) {
      throw new UnauthorizedException({ message: 'User already setup!' });
    }

    const result = setupUserDetailsSchema.safeParse(data);

    if (!result.success) {
      throw new BadRequestException({ message: 'Invalid information!' });
    }

    const { data: info } = result;

    await this.usersService.updateDetails(req.user.id, info);
  }

  @UseGuards(JwtVerifiedAuthGuard)
  @Get('perks')
  async getPerks(@Req() req: AuthenticatedRequest) {
    return {
      perks: ['10% OFF', 'Long range'],
    };
  }
}
