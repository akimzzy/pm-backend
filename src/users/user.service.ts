import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { ManagerAccount } from '../accounts/manager-account.entity';
import { TenantAccount } from '../accounts/tenant-account.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ManagerAccount)
    private readonly managerAccountRepository: Repository<ManagerAccount>,
    @InjectRepository(TenantAccount)
    private readonly tenantAccountRepository: Repository<TenantAccount>,
  ) {}

  async createUserWithAccounts(createUserDto: CreateUserDto) {
    const { email, password, name } = createUserDto;
    const existing = await this.userRepository.findOne({ where: { email } });
    if (existing) {
      throw new BadRequestException('Email already registered');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      name,
    });
    await this.userRepository.save(user);
    // Create both accounts
    const manager = this.managerAccountRepository.create({ user });
    const tenant = this.tenantAccountRepository.create({ user });
    await this.managerAccountRepository.save(manager);
    await this.tenantAccountRepository.save(tenant);
    return { user, manager, tenant };
  }

  async findUserWithAccountsByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
      relations: ['managerAccount', 'tenantAccount'],
    });
  }

  async findById(id: number) {
    return this.userRepository.findOne({
      where: { id },
      relations: ['managerAccount', 'tenantAccount'],
    });
  }
}
