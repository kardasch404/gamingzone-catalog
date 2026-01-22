import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

@ApiTags('platforms')
@Controller('api/platforms')
export class PlatformController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'List all platforms' })
  async list() {
    return this.prisma.platform.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get platform by ID' })
  async getById(@Param('id') id: string) {
    return this.prisma.platform.findUnique({ where: { id } });
  }
}
