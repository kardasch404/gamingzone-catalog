import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis.service';

@Injectable()
export class CacheService {
  private readonly TTL = {
    PRODUCT: 900,
    PRODUCT_LIST: 300,
    CATEGORY: 1800,
  };

  constructor(private redis: RedisService) {}

  async get<T>(key: string): Promise<T | null> {
    const data = await this.redis.getClient().get(key);
    return data ? JSON.parse(data) : null;
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    await this.redis.getClient().setex(key, ttl || this.TTL.PRODUCT, JSON.stringify(value));
  }

  async del(key: string): Promise<void> {
    await this.redis.getClient().del(key);
  }

  async delPattern(pattern: string): Promise<void> {
    const keys = await this.redis.getClient().keys(pattern);
    if (keys.length > 0) {
      await this.redis.getClient().del(...keys);
    }
  }

  productKey(id: string): string {
    return `product:${id}`;
  }

  productListKey(page: number, limit: number): string {
    return `products:page:${page}:limit:${limit}`;
  }

  categoriesKey(): string {
    return 'categories:all';
  }

  async invalidateProduct(id: string): Promise<void> {
    await this.del(this.productKey(id));
    await this.delPattern('products:page:*');
  }

  async invalidateCategories(): Promise<void> {
    await this.del(this.categoriesKey());
  }
}
