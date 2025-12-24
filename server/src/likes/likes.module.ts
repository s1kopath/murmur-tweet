import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { Like } from '../entities/like.entity';
import { Murmur } from '../entities/murmur.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Like, Murmur])],
  controllers: [LikesController],
  providers: [LikesService],
  exports: [LikesService],
})
export class LikesModule {}

