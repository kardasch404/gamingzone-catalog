import { Test } from '@nestjs/testing';
import { CatalogGrpcController } from '../../src/presentation/grpc/catalog.grpc.controller';
import { GetProductQuery } from '../../src/application/use-cases/queries/get-product.query';
import { SearchProductsQuery } from '../../src/application/use-cases/queries/search-products.query';

describe('CatalogGrpcController', () => {
  let controller: CatalogGrpcController;
  let getProduct: any;
  let searchProducts: any;

  beforeEach(async () => {
    getProduct = {
      byId: jest.fn(),
      bySku: jest.fn(),
    };

    searchProducts = {
      execute: jest.fn(),
    };

    const module = await Test.createTestingModule({
      controllers: [CatalogGrpcController],
      providers: [
        { provide: GetProductQuery, useValue: getProduct },
        { provide: SearchProductsQuery, useValue: searchProducts },
      ],
    }).compile();

    controller = module.get(CatalogGrpcController);
  });

  it('should get product by id', async () => {
    getProduct.byId.mockResolvedValue({
      id: '1',
      sku: 'SKU-001',
      name: 'Test Product',
      slug: 'test-product',
      basePrice: 599,
      categoryId: 'cat-1',
      status: 'ACTIVE',
      productType: 'GAME',
      condition: 'NEW',
    });

    const result = await controller.getProductById({ productId: '1' });

    expect(result.id).toBe('1');
    expect(result.sku).toBe('SKU-001');
  });

  it('should get product by SKU', async () => {
    getProduct.bySku.mockResolvedValue({
      id: '1',
      sku: 'SKU-001',
      name: 'Test Product',
      slug: 'test-product',
      basePrice: 599,
      categoryId: 'cat-1',
      status: 'ACTIVE',
      productType: 'GAME',
      condition: 'NEW',
    });

    const result = await controller.getProductBySku({ sku: 'SKU-001' });

    expect(result.sku).toBe('SKU-001');
  });

  it('should search products', async () => {
    searchProducts.execute.mockResolvedValue({
      products: [
        { id: '1', sku: 'SKU-001', name: 'Product 1', basePrice: 599, categoryId: 'cat-1', status: 'ACTIVE' },
      ],
      total: 1,
    });

    const result = await controller['searchProducts']({
      query: 'test',
      page: 1,
      limit: 20,
    });

    expect(result.products).toHaveLength(1);
    expect(result.total).toBe(1);
  });

  it('should return health check', async () => {
    const result = await controller.healthCheck();

    expect(result.status).toBe('ok');
    expect(result.service).toBe('catalog');
  });
});
