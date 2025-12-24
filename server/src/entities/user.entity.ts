import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Murmur } from './murmur.entity';
import { Follow } from './follow.entity';
import { Like } from './like.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @CreateDateColumn()
  created_at!: Date;

  @Column({ default: 0 })
  followers_count!: number;

  @Column({ default: 0 })
  following_count!: number;

  @OneToMany(() => Murmur, (murmur) => murmur.user)
  murmurs!: Murmur[];

  @OneToMany(() => Follow, (follow) => follow.follower)
  following!: Follow[];

  @OneToMany(() => Follow, (follow) => follow.following)
  followers!: Follow[];

  @OneToMany(() => Like, (like) => like.user)
  likes!: Like[];
}
