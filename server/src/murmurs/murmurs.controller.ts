import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { MurmursService } from './murmurs.service';
import { CreateMurmurDto } from './dto/create-murmur.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('murmurs')
export class MurmursController {
  constructor(private murmursService: MurmursService) {}

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.murmursService.findAll(page, limit);
  }

  @Get('timeline')
  @UseGuards(JwtAuthGuard)
  async getTimeline(
    @Request() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.murmursService.getTimeline(req.user.userId, page, limit);
  }

  @Get('users/:userId')
  async findByUserId(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.murmursService.findByUserId(userId, page, limit);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.murmursService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Request() req, @Body() createMurmurDto: CreateMurmurDto) {
    return this.murmursService.create(req.user.userId, createMurmurDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    await this.murmursService.remove(id, req.user.userId);
    return { message: 'Murmur deleted successfully' };
  }
}

