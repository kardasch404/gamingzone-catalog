import { Test } from '@nestjs/testing';
import { ProductIndexingService } from '../../../src/infrastructure/search/product-indexing.service';
import { ElasticsearchService } from '../../../src/infrastructure/search/elasticsearch.service';
import { Product, ProductType, Condition } from '../../../src/domain/entities/product.entity';
import { Money } from '../../../src/domain/value-objects/money.vo';

describe('ProductIndexingService', () => {
  let service: ProductIndexingService;
  let elasticsearch: any;

  beforeEach(async () => {
    elasticsearch = {
      getClient: jest.fn().mockReturnValue({
        index: jest.fn(),
        delete: jest.fn(),
        bulk: jest.fn(),
      }),
    };

    const module = await Test.createTestingModule({
      providers: [
        ProductIndexingService,
        {
          provide: ElasticsearchService,
          useValue: elasticsearch,
        },
      ],
    }).compile();

    service = module.get(ProductIndexingService);
  });

  it('should index product', async () => {
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

    await service.indexProduct(product);

    expect(elasticsearch.getClient().index).toHaveBeenCalledWith(
      expect.objectContaining({
        index: 'products',
        id: '1',
      }),
    );
  });

  it('should delete product from index', async () => {
    elasticsearch.getClient().delete.mockResolvedValue({});

    await service.deleteProduct('1');

    expect(elasticsearch.getClient().delete).toHaveBeenCalledWith({
      index: 'products',
      id: '1',
    });
  });

  it('should bulk index products', async () => {
    const products = [
      Product.create('1', 'SKU-001', 'Product 1', 'Desc', new Money(599), 'cat-1', ProductType.GAME, Condition.NEW),
      Product.create('2', 'SKU-002', 'Product 2', 'Desc', new Money(499), 'cat-1', ProductType.GAME, Condition.NEW),
    ];

    await service.bulkIndex(products);

    expect(elasticsearch.getClient().bulk).toHaveBeenCalled();
  });
});
