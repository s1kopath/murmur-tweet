import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Murmur } from "../entities/murmur.entity";
import { Follow } from "../entities/follow.entity";
import { Like } from "../entities/like.entity";
import { CreateMurmurDto } from "./dto/create-murmur.dto";

@Injectable()
export class MurmursService {
  constructor(
    @InjectRepository(Murmur)
    private murmursRepository: Repository<Murmur>,
    @InjectRepository(Follow)
    private followsRepository: Repository<Follow>,
    @InjectRepository(Like)
    private likesRepository: Repository<Like>
  ) {}

  async create(
    userId: number,
    createMurmurDto: CreateMurmurDto
  ): Promise<Murmur> {
    const murmur = this.murmursRepository.create({
      ...createMurmurDto,
      user_id: userId,
    });
    return this.murmursRepository.save(murmur);
  }

  async findAll(
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: Murmur[]; total: number; page: number; limit: number }> {
    const skip = (page - 1) * limit;
    const [data, total] = await this.murmursRepository.findAndCount({
      relations: ["user"],
      order: { created_at: "DESC" },
      skip,
      take: limit,
    });
    return { data, total, page, limit };
  }

  async findOne(id: number): Promise<Murmur> {
    const murmur = await this.murmursRepository.findOne({
      where: { id },
      relations: ["user"],
    });
    if (!murmur) {
      throw new NotFoundException(`Murmur with ID ${id} not found`);
    }
    return murmur;
  }

  async findByUserId(
    userId: number,
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: Murmur[]; total: number; page: number; limit: number }> {
    const skip = (page - 1) * limit;
    const [data, total] = await this.murmursRepository.findAndCount({
      where: { user_id: userId },
      relations: ["user"],
      order: { created_at: "DESC" },
      skip,
      take: limit,
    });
    return { data, total, page, limit };
  }

  async remove(id: number, userId: number): Promise<void> {
    const murmur = await this.findOne(id);
    if (murmur.user_id !== userId) {
      throw new ForbiddenException("You can only delete your own murmurs");
    }

    // Delete all likes associated with this murmur first (to avoid foreign key constraint issues)
    await this.likesRepository.delete({ murmur_id: id });

    // Now delete the murmur
    await this.murmursRepository.remove(murmur);
  }

  async getTimeline(
    userId: number,
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: Murmur[]; total: number; page: number; limit: number }> {
    const skip = (page - 1) * limit;

    // Get IDs of users being followed
    const follows = await this.followsRepository.find({
      where: { follower_id: userId },
      select: ["following_id"],
    });
    const followingIds = follows.map((f) => f.following_id);

    // Include own posts along with followed users' posts
    followingIds.push(userId);

    const queryBuilder = this.murmursRepository
      .createQueryBuilder("murmur")
      .leftJoinAndSelect("murmur.user", "user")
      .where("murmur.user_id IN (:...ids)", { ids: followingIds })
      .orderBy("murmur.created_at", "DESC")
      .skip(skip)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total, page, limit };
  }
}
