import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class ManagerAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.managerAccount, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}
