import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { ProductController } from '../../src/presentation/rest/controllers/product.controller';
import { CreateProductUseCase } from '../../src/application/use-cases/commands/create-product.use-case';
import { GetProductQuery } from '../../src/application/use-cases/queries/get-product.query';
import { SearchProductsQuery } from '../../src/application/use-cases/queries/search-products.query';
import { ProductType, Condition } from '../../src/domain/entities/product.entity';

describe('ProductController (e2e)', () => {
  let app: INestApplication;
  let createProduct: any;
  let getProduct: any;
  let searchProducts: any;

  beforeAll(async () => {
    createProduct = {
      execute: jest.fn().mockResolvedValue({
        id: '1',
        sku: 'SKU-001',
        name: 'Test Product',
        slug: 'test-product',
        basePrice: 599,
        status: 'DRAFT',
      }),
    };

    getProduct = {
      byId: jest.fn().mockResolvedValue({
        id: '1',
        name: 'Test Product',
      }),
      bySlug: jest.fn().mockResolvedValue({
        id: '1',
        name: 'Test Product',
      }),
    };

    searchProducts = {
      execute: jest.fn().mockResolvedValue({
        products: [],
        total: 0,
      }),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        { provide: CreateProductUseCase, useValue: createProduct },
        { provide: 'UpdateProductUseCase', useValue: {} },
        { provide: 'DeleteProductUseCase', useValue: {} },
        { provide: 'PublishProductUseCase', useValue: {} },
        { provide: GetProductQuery, useValue: getProduct },
        { provide: SearchProductsQuery, useValue: searchProducts },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/products (GET) - list products', () => {
    return request(app.getHttpServer())
      .get('/api/products')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('products');
        expect(res.body).toHaveProperty('total');
      });
  });

  it('/api/products/:id (GET) - get product by id', () => {
    return request(app.getHttpServer())
      .get('/api/products/1')
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toBe('1');
      });
  });

  it('/api/products (POST) - create product', () => {
    const dto = {
      sku: 'SKU-001',
      name: 'Test Product',
      fullDescription: 'Description',
      basePrice: 599,
      categoryId: 'cat-1',
      productType: ProductType.GAME,
      condition: Condition.NEW,
    };

    return request(app.getHttpServer())
      .post('/api/products')
      .send(dto)
      .expect(201);
  });
});
