import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { CreateProductDto } from '../../dtos/request/create-product.dto';
import { ProductResponseDto } from '../../dtos/response/product-response.dto';
import { CachedProductRepository } from '../../../infrastructure/database/repositories/cached-product.repository';
import { ProductIndexingService } from '../../../infrastructure/search/product-indexing.service';
import { Product } from '../../../domain/entities/product.entity';
import { Money } from '../../../domain/value-objects/money.vo';
import { ProductCreatedEvent } from '../../events/product.events';

@Injectable()
export class CreateProductUseCase {
  constructor(
    private repository: CachedProductRepository,
    private indexing: ProductIndexingService,
  ) {}

  async execute(dto: CreateProductDto): Promise<ProductResponseDto> {
    const existing = await this.repository.findBySku(dto.sku);
    if (existing) {
      throw new Error('SKU already exists');
    }

    const product = Product.create(
      uuid(),
      dto.sku,
      dto.name,
      dto.fullDescription,
      new Money(dto.basePrice),
      dto.categoryId,
      dto.productType,
      dto.condition,
      dto.shortDescription,
      dto.comparePrice ? new Money(dto.comparePrice) : null,
      dto.platformId,
    );

    const saved = await this.repository.save(product);
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
