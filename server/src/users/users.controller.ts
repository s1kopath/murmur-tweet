import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Request() req) {
    return this.usersService.getProfile(req.user.userId);
  }

  @Get(':id')
  async getProfile(@Param('id') id: number) {
    const user = await this.usersService.getProfile(id);
    const { password, ...profile } = user;
    return profile;
  }
}

