import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from '../entities/follow.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class FollowsService {
  constructor(
    @InjectRepository(Follow)
    private followsRepository: Repository<Follow>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async follow(followerId: number, followingId: number): Promise<Follow> {
    if (followerId === followingId) {
      throw new BadRequestException('Cannot follow yourself');
    }

    const following = await this.usersRepository.findOne({
      where: { id: followingId },
    });
    if (!following) {
      throw new NotFoundException(`User with ID ${followingId} not found`);
    }

    const existingFollow = await this.followsRepository.findOne({
      where: { follower_id: followerId, following_id: followingId },
    });
    if (existingFollow) {
      throw new BadRequestException('Already following this user');
    }

    const follow = this.followsRepository.create({
      follower_id: followerId,
      following_id: followingId,
    });

    // Update counts
    await this.usersRepository.increment({ id: followerId }, 'following_count', 1);
    await this.usersRepository.increment({ id: followingId }, 'followers_count', 1);

    return this.followsRepository.save(follow);
  }

  async unfollow(followerId: number, followingId: number): Promise<void> {
    const follow = await this.followsRepository.findOne({
      where: { follower_id: followerId, following_id: followingId },
    });
    if (!follow) {
      throw new NotFoundException('Follow relationship not found');
    }

    await this.followsRepository.remove(follow);

    // Update counts
    await this.usersRepository.decrement({ id: followerId }, 'following_count', 1);
    await this.usersRepository.decrement({ id: followingId }, 'followers_count', 1);
  }

  async isFollowing(followerId: number, followingId: number): Promise<boolean> {
    const follow = await this.followsRepository.findOne({
      where: { follower_id: followerId, following_id: followingId },
    });
    return !!follow;
  }
}

