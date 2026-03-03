import { Injectable } from '@nestjs/common';
import { ProductResponseDto } from '../../dtos/response/product-response.dto';
import { CachedProductRepository } from '../../../infrastructure/database/repositories/cached-product.repository';
import { Product } from '../../../domain/entities/product.entity';

@Injectable()
export class GetProductQuery {
  constructor(private repository: CachedProductRepository) {}

  async byId(id: string): Promise<ProductResponseDto | null> {
    const product = await this.repository.findById(id);
    return product ? this.toDto(product) : null;
  }

  async bySku(sku: string): Promise<ProductResponseDto | null> {
    const product = await this.repository.findBySku(sku);
    return product ? this.toDto(product) : null;
  }

  async bySlug(slug: string): Promise<ProductResponseDto | null> {
    const product = await this.repository.findBySlug(slug);
    return product ? this.toDto(product) : null;
  }

  private toDto(product: Product): ProductResponseDto {
    return {
      id: product.id,
      sku: product.sku,
      name: product.name,
      slug: product.slug.toString(),
      shortDescription: product.shortDescription,
      fullDescription: product.fullDescription,
      basePrice: product.basePrice.amount,
      comparePrice: product.comparePrice?.amount || null,
      currency: product.basePrice.currency,
      categoryId: product.categoryId,
      platformId: product.platformId,
      productType: product.productType,
      condition: product.condition,
      status: product.status,
      publishedAt: product.publishedAt,
      createdAt: new Date(),
    };
  }
}
