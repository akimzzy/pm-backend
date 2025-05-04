import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { ManagerAccount } from '../accounts/manager-account.entity';
import { TenantAccount } from '../accounts/tenant-account.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UserService } from '../users/user.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ManagerAccount)
    private readonly managerAccountRepository: Repository<ManagerAccount>,
    @InjectRepository(TenantAccount)
    private readonly tenantAccountRepository: Repository<TenantAccount>,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    // Delegate user creation to UserService
    const { user, manager, tenant } =
      await this.userService.createUserWithAccounts(createUserDto);
    return this.generateAuthResponse(user, manager, tenant);
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['managerAccount', 'tenantAccount'],
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.generateAuthResponse(
      user,
      user.managerAccount,
      user.tenantAccount,
    );
  }

  private generateAuthResponse(
    user: User,
    manager: ManagerAccount,
    tenant: TenantAccount,
  ) {
    const payload = {
      sub: user.id,
    };
    const token = this.jwtService.sign(payload);
    return {
      access_token: token,
      user: { id: user.id, email: user.email, name: user.name },
      managerAccount: { id: manager.id },
      tenantAccount: { id: tenant.id },
    };
  }
}
