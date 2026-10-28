import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('verification-code')
export class VerificationCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  phone: string;

  @Column()
  code: string;

  @CreateDateColumn({ utc: true, type: 'timestamptz' })
  createdAt: Date;

  @Column({ default: true })
  active: boolean;
}
