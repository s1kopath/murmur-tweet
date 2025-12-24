import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from '../entities/like.entity';
import { Murmur } from '../entities/murmur.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,
    @InjectRepository(Murmur)
    private murmursRepository: Repository<Murmur>,
  ) {}

  async like(userId: number, murmurId: number): Promise<Like> {
    const murmur = await this.murmursRepository.findOne({
      where: { id: murmurId },
    });
    if (!murmur) {
      throw new NotFoundException(`Murmur with ID ${murmurId} not found`);
    }

    const existingLike = await this.likesRepository.findOne({
      where: { user_id: userId, murmur_id: murmurId },
    });
    if (existingLike) {
      throw new BadRequestException('Already liked this murmur');
    }

    const like = this.likesRepository.create({
      user_id: userId,
      murmur_id: murmurId,
    });

    await this.likesRepository.save(like);
    await this.murmursRepository.increment({ id: murmurId }, 'likes_count', 1);

    return like;
  }

  async unlike(userId: number, murmurId: number): Promise<void> {
    const like = await this.likesRepository.findOne({
      where: { user_id: userId, murmur_id: murmurId },
    });
    if (!like) {
      throw new BadRequestException('Like not found');
    }

    await this.likesRepository.remove(like);
    await this.murmursRepository.decrement({ id: murmurId }, 'likes_count', 1);
  }

  async isLiked(userId: number, murmurId: number): Promise<boolean> {
    const like = await this.likesRepository.findOne({
      where: { user_id: userId, murmur_id: murmurId },
    });
    return !!like;
  }

  async getUserLikedMurmurs(userId: number): Promise<number[]> {
    const likes = await this.likesRepository.find({
      where: { user_id: userId },
      select: ['murmur_id'],
    });
    return likes.map((like) => like.murmur_id);
  }
}

