import { Test } from '@nestjs/testing';
import { ProductRepository } from '../../../src/infrastructure/database/repositories/product.repository';
import { PrismaService } from '../../../src/infrastructure/database/prisma.service';
import { Product, ProductType, Condition } from '../../../src/domain/entities/product.entity';
import { Money } from '../../../src/domain/value-objects/money.vo';

describe('ProductRepository', () => {
  let repository: ProductRepository;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ProductRepository,
        {
          provide: PrismaService,
          useValue: {
            product: {
              findUnique: jest.fn(),
              upsert: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    repository = module.get(ProductRepository);
    prisma = module.get(PrismaService);
  });

  it('should find product by id', async () => {
    const mockProduct = {
      id: '1',
      sku: 'SKU-001',
      name: 'Test Product',
      slug: 'test-product',
      shortDescription: null,
      fullDescription: 'Description',
      basePrice: 599,
      comparePrice: null,
      currency: 'MAD',
      categoryId: 'cat-1',
      platformId: null,
      productType: 'GAME',
      condition: 'NEW',
      status: 'DRAFT',
      isDeleted: false,
      publishedAt: null,
      images: [],
      specifications: [],
    };

    jest.spyOn(prisma.product, 'findUnique').mockResolvedValue(mockProduct as any);

    const result = await repository.findById('1');
    expect(result).toBeDefined();
    expect(result?.name).toBe('Test Product');
  });

  it('should save product', async () => {
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

    const mockSaved = {
      id: '1',
      sku: 'SKU-001',
      name: 'Test Product',
      slug: 'test-product',
      shortDescription: null,
      fullDescription: 'Description',
      basePrice: 599,
      comparePrice: null,
      currency: 'MAD',
      categoryId: 'cat-1',
      platformId: null,
      productType: 'GAME',
      condition: 'NEW',
      status: 'DRAFT',
      isDeleted: false,
      publishedAt: null,
      images: [],
      specifications: [],
    };

    jest.spyOn(prisma.product, 'upsert').mockResolvedValue(mockSaved as any);

    const result = await repository.save(product);
    expect(result).toBeDefined();
    expect(prisma.product.upsert).toHaveBeenCalled();
  });
});
