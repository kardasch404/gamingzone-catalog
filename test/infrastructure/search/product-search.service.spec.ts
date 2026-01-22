import { Test } from '@nestjs/testing';
import { ProductSearchService } from '../../../src/infrastructure/search/product-search.service';
import { ElasticsearchService } from '../../../src/infrastructure/search/elasticsearch.service';

describe('ProductSearchService', () => {
  let service: ProductSearchService;
  let elasticsearch: any;

  beforeEach(async () => {
    elasticsearch = {
      getClient: jest.fn().mockReturnValue({
        search: jest.fn(),
      }),
    };

    const module = await Test.createTestingModule({
      providers: [
        ProductSearchService,
        {
          provide: ElasticsearchService,
          useValue: elasticsearch,
        },
      ],
    }).compile();

    service = module.get(ProductSearchService);
  });

  it('should search products with query', async () => {
    const mockResult = {
      hits: {
        hits: [
          {
            _source: {
              id: '1',
              name: 'God of War',
              basePrice: 599,
            },
          },
        ],
        total: { value: 1 },
      },
      aggregations: {},
    };

    elasticsearch.getClient().search.mockResolvedValue(mockResult);

    const result = await service.search('God of War');
    
    expect(result.products).toHaveLength(1);
    expect(result.total).toBe(1);
    expect(elasticsearch.getClient().search).toHaveBeenCalled();
  });

  it('should apply filters', async () => {
    const mockResult = {
      hits: { hits: [], total: { value: 0 } },
      aggregations: {},
    };

    elasticsearch.getClient().search.mockResolvedValue(mockResult);

    await service.search('test', {
      categoryId: 'cat-1',
      minPrice: 100,
      maxPrice: 500,
    });

    const searchCall = elasticsearch.getClient().search.mock.calls[0][0];
    expect(searchCall.body.query.bool.filter).toBeDefined();
  });

  it('should provide autocomplete suggestions', async () => {
    const mockResult = {
      hits: {
        hits: [
          { _source: { name: 'God of War' } },
          { _source: { name: 'God of War Ragnarok' } },
        ],
        total: { value: 2 },
      },
    };

    elasticsearch.getClient().search.mockResolvedValue(mockResult);

    const result = await service.autocomplete('God');
    
    expect(result).toHaveLength(2);
    expect(result[0]).toBe('God of War');
  });

  it('should search by category', async () => {
    const mockResult = {
      hits: { hits: [], total: { value: 0 } },
    };

    elasticsearch.getClient().search.mockResolvedValue(mockResult);

    await service.searchByCategory('cat-1');

    const searchCall = elasticsearch.getClient().search.mock.calls[0][0];
    expect(searchCall.body.query.bool.filter).toContainEqual({
      term: { 'category.id': 'cat-1' },
    });
  });
});
