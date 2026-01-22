import { Injectable } from '@nestjs/common';
import { CachedProductRepository } from '../../../infrastructure/database/repositories/cached-product.repository';
import { ProductIndexingService } from '../../../infrastructure/search/product-indexing.service';

@Injectable()
export class DeleteProductUseCase {
  constructor(
    private repository: CachedProductRepository,
    private indexing: ProductIndexingService,
  ) {}

  async execute(id: string): Promise<void> {
    const product = await this.repository.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }

    const deleted = product.softDelete();
    await this.repository.save(deleted);
    await this.indexing.deleteProduct(id);
  }
}
