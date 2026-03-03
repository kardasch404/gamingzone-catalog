import { Test } from '@nestjs/testing';
import { GetProductQuery } from '../../../src/application/use-cases/queries/get-product.query';
import { CachedProductRepository } from '../../../src/infrastructure/database/repositories/cached-product.repository';
import { Product, ProductType, Condition } from '../../../src/domain/entities/product.entity';
import { Money } from '../../../src/domain/value-objects/money.vo';

describe('GetProductQuery', () => {
  let query: GetProductQuery;
  let repository: any;

  beforeEach(async () => {
    repository = {
      findById: jest.fn(),
      findBySku: jest.fn(),
      findBySlug: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        GetProductQuery,
        { provide: CachedProductRepository, useValue: repository },
      ],
    }).compile();

    query = module.get(GetProductQuery);
  });

  it('should get product by id', async () => {
    const product = Product.create(
      '1',
      'SKU-001',
      'Test Product',
      'Description',
      new Money(599),
      'cat-1',
      ProductType.GAME,
      Condition.NEW,
    );

    repository.findById.mockResolvedValue(product);

    const result = await query.byId('1');

    expect(result).toBeDefined();
    expect(result?.name).toBe('Test Product');
  });

  it('should return null if product not found', async () => {
    repository.findById.mockResolvedValue(null);

    const result = await query.byId('999');

    expect(result).toBeNull();
  });

  it('should get product by SKU', async () => {
    const product = Product.create(
      '1',
      'SKU-001',
      'Test Product',
      'Description',
      new Money(599),
      'cat-1',
      ProductType.GAME,
      Condition.NEW,
    );

    repository.findBySku.mockResolvedValue(product);

    const result = await query.bySku('SKU-001');

    expect(result).toBeDefined();
    expect(result?.sku).toBe('SKU-001');
  });
});
