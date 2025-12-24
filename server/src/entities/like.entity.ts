import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Murmur } from './murmur.entity';

@Entity()
export class Like {
  @PrimaryColumn()
  user_id!: number;

  @PrimaryColumn()
  murmur_id!: number;

  @ManyToOne(() => User, (user) => user.likes)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Murmur, (murmur) => murmur.likes)
  @JoinColumn({ name: 'murmur_id' })
  murmur!: Murmur;

  @CreateDateColumn()
  created_at!: Date;
}

