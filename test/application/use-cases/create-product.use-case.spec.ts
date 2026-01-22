import { Test } from '@nestjs/testing';
import { CreateProductUseCase } from '../../../src/application/use-cases/commands/create-product.use-case';
import { CachedProductRepository } from '../../../src/infrastructure/database/repositories/cached-product.repository';
import { ProductIndexingService } from '../../../src/infrastructure/search/product-indexing.service';
import { ProductType, Condition } from '../../../src/domain/entities/product.entity';

describe('CreateProductUseCase', () => {
  let useCase: CreateProductUseCase;
  let repository: any;
  let indexing: any;

  beforeEach(async () => {
    repository = {
      findBySku: jest.fn(),
      save: jest.fn(),
    };

    indexing = {
      indexProduct: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        CreateProductUseCase,
        { provide: CachedProductRepository, useValue: repository },
        { provide: ProductIndexingService, useValue: indexing },
      ],
    }).compile();

    useCase = module.get(CreateProductUseCase);
  });

  it('should create product successfully', async () => {
    repository.findBySku.mockResolvedValue(null);
    repository.save.mockImplementation((product) => Promise.resolve(product));

    const dto = {
      sku: 'SKU-001',
      name: 'God of War',
      fullDescription: 'Epic game',
      basePrice: 599,
      categoryId: 'cat-1',
      productType: ProductType.GAME,
      condition: Condition.NEW,
    };

    const result = await useCase.execute(dto);

    expect(result.name).toBe('God of War');
    expect(result.sku).toBe('SKU-001');
    expect(repository.save).toHaveBeenCalled();
    expect(indexing.indexProduct).toHaveBeenCalled();
  });

  it('should throw error if SKU exists', async () => {
    repository.findBySku.mockResolvedValue({ id: '1' });

    const dto = {
      sku: 'SKU-001',
      name: 'God of War',
      fullDescription: 'Epic game',
      basePrice: 599,
      categoryId: 'cat-1',
      productType: ProductType.GAME,
      condition: Condition.NEW,
    };

    await expect(useCase.execute(dto)).rejects.toThrow('SKU already exists');
  });
});
