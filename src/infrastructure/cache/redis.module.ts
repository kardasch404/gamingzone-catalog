import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { CacheService } from './redis/cache.service';

@Module({
  providers: [RedisService, CacheService],
  exports: [RedisService, CacheService],
})
export class RedisModule {}
