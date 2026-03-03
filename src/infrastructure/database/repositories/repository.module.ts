import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database.module';
import { RedisModule } from '../../cache/redis.module';
import { ProductRepository } from './product.repository';
import { CategoryRepository } from './category.repository';
import { CachedProductRepository } from './cached-product.repository';
import { CachedCategoryRepository } from './cached-category.repository';
import { CacheService } from '../../cache/redis/cache.service';

@Module({
  imports: [DatabaseModule, RedisModule],
  providers: [
    ProductRepository,
    CategoryRepository,
    CacheService,
    CachedProductRepository,
    CachedCategoryRepository,
  ],
  exports: [CachedProductRepository, CachedCategoryRepository],
})
export class RepositoryModule {}
