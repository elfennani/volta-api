import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity.js';
import type { SetupUserDetailsDto } from './dto/setup-user-details.dto.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  create(phone: string) {
    const user = this.usersRepository.create({
      phone,
      firstName: '',
      lastName: '',
      email: '',
    });

    return this.usersRepository.save(user);
  }

  async updateDetails(userId: string, info: SetupUserDetailsDto) {
    await this.usersRepository.update(userId, {
      isActive: true,
      firstName: info.firstName,
      lastName: info.lastName,
      email: info.email,
    });
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  findOneByPhone(phone: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ phone });
  }
}
