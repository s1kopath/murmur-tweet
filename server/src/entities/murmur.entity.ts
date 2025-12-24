import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Like } from './like.entity';

@Entity()
export class Murmur {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  user_id!: number;

  @ManyToOne(() => User, (user) => user.murmurs)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column('text')
  text!: string;

  @Column({ default: 0 })
  likes_count!: number;

  @CreateDateColumn()
  created_at!: Date;

  @OneToMany(() => Like, (like) => like.murmur)
  likes!: Like[];
}

