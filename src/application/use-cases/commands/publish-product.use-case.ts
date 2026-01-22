import { Injectable } from '@nestjs/common';
import { ProductResponseDto } from '../../dtos/response/product-response.dto';
import { CachedProductRepository } from '../../../infrastructure/database/repositories/cached-product.repository';
import { ProductIndexingService } from '../../../infrastructure/search/product-indexing.service';

@Injectable()
export class PublishProductUseCase {
  constructor(
    private repository: CachedProductRepository,
    private indexing: ProductIndexingService,
  ) {}

  async execute(id: string): Promise<ProductResponseDto> {
    const product = await this.repository.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }

    if (!product.canPublish()) {
      throw new Error('Product cannot be published. Must have at least 1 image');
    }

    const published = product.publish();
    const saved = await this.repository.save(published);
    await this.indexing.indexProduct(saved);

    return this.toDto(saved);
  }

  private toDto(product: any): ProductResponseDto {
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
