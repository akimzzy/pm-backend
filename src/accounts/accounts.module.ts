import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManagerAccount } from './manager-account.entity';
import { TenantAccount } from './tenant-account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ManagerAccount, TenantAccount])],

  exports: [TypeOrmModule],
})
export class AccountsModule {}
