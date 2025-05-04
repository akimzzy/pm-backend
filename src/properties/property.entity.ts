import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Property {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  price: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  yearlyRent: number;

  @Column('simple-array', { nullable: true })
  images: string[];

  @Column({ default: true })
  available: boolean;

  @Column({ nullable: true })
  street: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  zipCode: string;

  @Column({ type: 'int', default: 1 })
  rooms: number;

  @Column({ type: 'int', default: 1 })
  bathrooms: number;

  @Column({ type: 'int', default: 1 })
  toilets: number;

  @Column('jsonb', { nullable: true })
  features: { key: string; value: string }[];
}
