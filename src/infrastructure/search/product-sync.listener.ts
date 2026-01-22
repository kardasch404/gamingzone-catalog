import { Injectable } from '@nestjs/common';
import { ProductIndexingService } from './product-indexing.service';
import { Product } from '../../domain/entities/product.entity';

@Injectable()
export class ProductSyncListener {
  constructor(private indexing: ProductIndexingService) {}

  async onProductCreated(product: Product): Promise<void> {
    await this.indexing.indexProduct(product);
  }

  async onProductUpdated(product: Product): Promise<void> {
    await this.indexing.indexProduct(product);
  }

  async onProductDeleted(productId: string): Promise<void> {
    await this.indexing.deleteProduct(productId);
  }
}
