import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { FollowsService } from './follows.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('follows')
export class FollowsController {
  constructor(private followsService: FollowsService) {}

  @Post(':id')
  @UseGuards(JwtAuthGuard)
  async follow(@Param('id', ParseIntPipe) id: number, @Request() req) {
    await this.followsService.follow(req.user.userId, id);
    return { message: 'Successfully followed user' };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async unfollow(@Param('id', ParseIntPipe) id: number, @Request() req) {
    await this.followsService.unfollow(req.user.userId, id);
    return { message: 'Successfully unfollowed user' };
  }

  @Get(':id/status')
  @UseGuards(JwtAuthGuard)
  async getFollowStatus(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const isFollowing = await this.followsService.isFollowing(req.user.userId, id);
    return { isFollowing };
  }
}

