import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MurmursService } from './murmurs.service';
import { MurmursController } from './murmurs.controller';
import { Murmur } from '../entities/murmur.entity';
import { Follow } from '../entities/follow.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Murmur, Follow])],
  controllers: [MurmursController],
  providers: [MurmursService],
  exports: [MurmursService],
})
export class MurmursModule {}

