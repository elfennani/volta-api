import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VerificationCode } from './entities/verification-code.entity.js';
import { MoreThan, Repository } from 'typeorm';
import { UsersService } from '../users/users.service.js';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(VerificationCode)
    private verificationCodeRepository: Repository<VerificationCode>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async createVerificationCode(phone: string): Promise<VerificationCode> {
    const code = Math.min(Math.round(Math.random() * 1000000), 999999);

    // Invalidate previously created codes
    await this.verificationCodeRepository.update({ phone }, { active: false });

    const codeEntity = this.verificationCodeRepository.create({
      phone,
      // TODO: Save a hashed code instead of raw value
      code: code.toString(),
    });

    return await this.verificationCodeRepository.save(codeEntity);
  }

  async getLastCodeTimestamp(phone: string): Promise<Date | null> {
    const lastCode = await this.verificationCodeRepository.findOne({
      select: { createdAt: true },
      where: { phone },
      order: { id: 'DESC' },
    });

    return lastCode?.createdAt ?? null;
  }

  getVerificationCode(
    phone: string,
    code: string,
  ): Promise<VerificationCode | null> {
    return this.verificationCodeRepository.findOne({
      where: {
        phone,
        code,
        active: true,
        createdAt: MoreThan(new Date(Date.now() - 15 * 60 * 1000)),
      },
      order: { id: 'DESC' },
    });
  }

  async login(phone: string) {
    let user = await this.usersService.findOneByPhone(phone);

    if (!user) {
      user = await this.usersService.create(phone);
    }

    return {
      accessToken: this.jwtService.sign({ userId: user.id }),
    };
  }

  async invalidateCode(id: number) {
    await this.verificationCodeRepository.update(id, { active: false });
  }
}
