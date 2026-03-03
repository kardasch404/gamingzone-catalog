import { Injectable } from '@nestjs/common';
import { UpdateProductDto } from '../../dtos/request/update-product.dto';
import { ProductResponseDto } from '../../dtos/response/product-response.dto';
import { CachedProductRepository } from '../../../infrastructure/database/repositories/cached-product.repository';
import { ProductIndexingService } from '../../../infrastructure/search/product-indexing.service';
import { Product } from '../../../domain/entities/product.entity';
import { Money } from '../../../domain/value-objects/money.vo';

@Injectable()
export class UpdateProductUseCase {
  constructor(
    private repository: CachedProductRepository,
    private indexing: ProductIndexingService,
  ) {}

  async execute(id: string, dto: UpdateProductDto): Promise<ProductResponseDto> {
    const product = await this.repository.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }

    const updated = new Product(
      product.id,
      product.sku,
      dto.name || product.name,
      product.slug,
      dto.shortDescription !== undefined ? dto.shortDescription : product.shortDescription,
      dto.fullDescription || product.fullDescription,
      dto.basePrice ? new Money(dto.basePrice) : product.basePrice,
      dto.comparePrice ? new Money(dto.comparePrice) : product.comparePrice,
      dto.categoryId || product.categoryId,
      dto.platformId !== undefined ? dto.platformId : product.platformId,
      dto.productType || product.productType,
      dto.condition || product.condition,
      product.status,
      product.images,
      product.specifications,
      product.isDeleted,
      product.publishedAt,
    );

    const saved = await this.repository.save(updated);
    await this.indexing.indexProduct(saved);

    return this.toDto(saved);
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
