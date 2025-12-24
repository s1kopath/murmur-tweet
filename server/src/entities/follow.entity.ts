import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Follow {
  @PrimaryColumn()
  follower_id!: number;

  @PrimaryColumn()
  following_id!: number;

  @ManyToOne(() => User, (user) => user.following)
  @JoinColumn({ name: 'follower_id' })
  follower!: User;

  @ManyToOne(() => User, (user) => user.followers)
  @JoinColumn({ name: 'following_id' })
  following!: User;

  @CreateDateColumn()
  created_at!: Date;
}

