import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../../database/repositories/product.repository';
import { CacheService } from '../../cache/redis/cache.service';
import { IProductRepository } from '../../../domain/repositories/product.repository';
import { Product } from '../../../domain/entities/product.entity';

@Injectable()
export class CachedProductRepository implements IProductRepository {
  constructor(
    private repository: ProductRepository,
    private cache: CacheService,
  ) {}

  async findById(id: string): Promise<Product | null> {
    const cacheKey = this.cache.productKey(id);
    const cached = await this.cache.get<any>(cacheKey);
    
    if (cached) {
      return this.deserialize(cached);
    }

    const product = await this.repository.findById(id);
    if (product) {
      await this.cache.set(cacheKey, this.serialize(product));
    }
    return product;
  }

  async findBySku(sku: string): Promise<Product | null> {
    return this.repository.findBySku(sku);
  }

  async findBySlug(slug: string): Promise<Product | null> {
    return this.repository.findBySlug(slug);
  }

  async save(product: Product): Promise<Product> {
    const saved = await this.repository.save(product);
    await this.cache.invalidateProduct(product.id);
    return saved;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
    await this.cache.invalidateProduct(id);
  }

  private serialize(product: Product): any {
    return {
      id: product.id,
      sku: product.sku,
      name: product.name,
      slug: product.slug.toString(),
      shortDescription: product.shortDescription,
      fullDescription: product.fullDescription,
      basePrice: product.basePrice.amount,
      currency: product.basePrice.currency,
      comparePrice: product.comparePrice?.amount,
      categoryId: product.categoryId,
      platformId: product.platformId,
      productType: product.productType,
      condition: product.condition,
      status: product.status,
      images: product.images,
      specifications: product.specifications,
      isDeleted: product.isDeleted,
      publishedAt: product.publishedAt,
    };
  }

  private deserialize(data: any): Product {
    return Product.create(
      data.id,
      data.sku,
      data.name,
      data.fullDescription,
      { amount: data.basePrice, currency: data.currency } as any,
      data.categoryId,
      data.productType,
      data.condition,
      data.shortDescription,
      data.comparePrice ? { amount: data.comparePrice, currency: data.currency } as any : null,
      data.platformId,
    );
  }
}
