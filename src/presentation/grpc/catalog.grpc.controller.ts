import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { GetProductQuery } from '../../../application/use-cases/queries/get-product.query';
import { SearchProductsQuery } from '../../../application/use-cases/queries/search-products.query';

interface GetProductRequest {
  productId: string;
}

interface GetProductBySkuRequest {
  sku: string;
}

interface SearchProductsRequest {
  query: string;
  page: number;
  limit: number;
  categoryId?: string;
  platformId?: string;
}

interface GetProductsByIdsRequest {
  productIds: string[];
}

@Controller()
export class CatalogGrpcController {
  constructor(
    private getProduct: GetProductQuery,
    private searchProducts: SearchProductsQuery,
  ) {}

  @GrpcMethod('CatalogService', 'GetProduct')
  async getProductById(data: GetProductRequest) {
    const product = await this.getProduct.byId(data.productId);
    if (!product) {
      throw new Error('Product not found');
    }
    return {
      id: product.id,
      sku: product.sku,
      name: product.name,
      slug: product.slug,
      basePrice: product.basePrice,
      categoryId: product.categoryId,
      status: product.status,
      productType: product.productType,
      condition: product.condition,
    };
  }

  @GrpcMethod('CatalogService', 'GetProductBySku')
  async getProductBySku(data: GetProductBySkuRequest) {
    const product = await this.getProduct.bySku(data.sku);
    if (!product) {
      throw new Error('Product not found');
    }
    return {
      id: product.id,
      sku: product.sku,
      name: product.name,
      slug: product.slug,
      basePrice: product.basePrice,
      categoryId: product.categoryId,
      status: product.status,
      productType: product.productType,
      condition: product.condition,
    };
  }

  @GrpcMethod('CatalogService', 'SearchProducts')
  async searchProducts(data: SearchProductsRequest) {
    const result = await this.searchProducts.execute({
      query: data.query,
      categoryId: data.categoryId,
      platformId: data.platformId,
      page: data.page || 1,
      limit: data.limit || 20,
    });

    return {
      products: result.products.map(p => ({
        id: p.id,
        sku: p.sku,
        name: p.name,
        slug: p.slug,
        basePrice: p.basePrice,
        categoryId: p.categoryId,
        status: p.status,
      })),
      total: result.total,
    };
  }

  @GrpcMethod('CatalogService', 'GetProductsByIds')
  async getProductsByIds(data: GetProductsByIdsRequest) {
    const products = await Promise.all(
      data.productIds.map(id => this.getProduct.byId(id))
    );

    return {
      products: products.filter(p => p !== null).map(p => ({
        id: p!.id,
        sku: p!.sku,
        name: p!.name,
        slug: p!.slug,
        basePrice: p!.basePrice,
        categoryId: p!.categoryId,
        status: p!.status,
      })),
    };
  }

  @GrpcMethod('CatalogService', 'HealthCheck')
  async healthCheck() {
    return {
      status: 'ok',
      service: 'catalog',
    };
  }
}
