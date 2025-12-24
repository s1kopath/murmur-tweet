import {
  Controller,
  Post,
  Delete,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('likes')
export class LikesController {
  constructor(private likesService: LikesService) {}

  @Post('murmurs/:id')
  @UseGuards(JwtAuthGuard)
  async like(@Param('id', ParseIntPipe) id: number, @Request() req) {
    await this.likesService.like(req.user.userId, id);
    return { message: 'Successfully liked murmur' };
  }

  @Delete('murmurs/:id')
  @UseGuards(JwtAuthGuard)
  async unlike(@Param('id', ParseIntPipe) id: number, @Request() req) {
    await this.likesService.unlike(req.user.userId, id);
    return { message: 'Successfully unliked murmur' };
  }
}

