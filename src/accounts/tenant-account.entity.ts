import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class TenantAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.tenantAccount, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}
