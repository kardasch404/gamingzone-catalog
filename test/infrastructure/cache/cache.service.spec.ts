import { Test } from '@nestjs/testing';
import { CacheService } from '../../../src/infrastructure/cache/redis/cache.service';
import { RedisService } from '../../../src/infrastructure/cache/redis.service';

describe('CacheService', () => {
  let service: CacheService;
  let redis: any;

  beforeEach(async () => {
    redis = {
      get: jest.fn(),
      setex: jest.fn(),
      del: jest.fn(),
      keys: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        CacheService,
        {
          provide: RedisService,
          useValue: {
            getClient: () => redis,
          },
        },
      ],
    }).compile();

    service = module.get(CacheService);
  });

  it('should get cached value', async () => {
    const mockData = { id: '1', name: 'Test' };
    redis.get.mockResolvedValue(JSON.stringify(mockData));

    const result = await service.get('test-key');
    expect(result).toEqual(mockData);
  });

  it('should set cache with TTL', async () => {
    await service.set('test-key', { id: '1' }, 300);
    expect(redis.setex).toHaveBeenCalledWith('test-key', 300, JSON.stringify({ id: '1' }));
  });

  it('should invalidate product cache', async () => {
    redis.keys.mockResolvedValue(['products:page:1:limit:10']);
    
    await service.invalidateProduct('1');
    
    expect(redis.del).toHaveBeenCalledWith('product:1');
    expect(redis.keys).toHaveBeenCalledWith('products:page:*');
  });

  it('should generate correct cache keys', () => {
    expect(service.productKey('123')).toBe('product:123');
    expect(service.productListKey(1, 10)).toBe('products:page:1:limit:10');
    expect(service.categoriesKey()).toBe('categories:all');
  });
});
