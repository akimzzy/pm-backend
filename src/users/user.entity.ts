import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { ManagerAccount } from '../accounts/manager-account.entity';
import { TenantAccount } from '../accounts/tenant-account.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @OneToOne(() => ManagerAccount, (manager) => manager.user)
  managerAccount: ManagerAccount;

  @OneToOne(() => TenantAccount, (tenant) => tenant.user)
  tenantAccount: TenantAccount;
}
