import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

  async findAll(): Promise<Omit<User, "password">[]> {
    const users = await this.usersRepository
      .createQueryBuilder("user")
      .select([
        "user.id",
        "user.username",
        "user.name",
        "user.email",
        "user.created_at",
        "user.followers_count",
        "user.following_count",
      ])
      .getMany();

    return users as Omit<User, "password">[];
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ["murmurs"],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async getProfile(id: number): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ["murmurs"],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const { password, ...profile } = user;
    return profile;
  }
}
