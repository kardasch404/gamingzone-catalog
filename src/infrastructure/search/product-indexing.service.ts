import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from './elasticsearch.service';
import { ELASTICSEARCH_CONFIG } from './elasticsearch.config';
import { Product } from '../../domain/entities/product.entity';

@Injectable()
export class ProductIndexingService {
  constructor(private elasticsearch: ElasticsearchService) {}

  async indexProduct(product: Product): Promise<void> {
    await this.elasticsearch.getClient().index({
      index: ELASTICSEARCH_CONFIG.INDEX,
      id: product.id,
      document: {
        id: product.id,
        sku: product.sku,
        name: product.name,
        description: product.fullDescription,
        category: {
          id: product.categoryId,
          name: '',
        },
        platform: product.platformId,
        basePrice: product.basePrice.amount,
        productType: product.productType,
        condition: product.condition,
        status: product.status,
        publishedAt: product.publishedAt,
      },
    });
  }

  async deleteProduct(id: string): Promise<void> {
    await this.elasticsearch.getClient().delete({
      index: ELASTICSEARCH_CONFIG.INDEX,
      id,
    }).catch(() => {});
  }

  async bulkIndex(products: Product[]): Promise<void> {
    const operations = products.flatMap(product => [
      { index: { _index: ELASTICSEARCH_CONFIG.INDEX, _id: product.id } },
      {
        id: product.id,
        sku: product.sku,
        name: product.name,
        description: product.fullDescription,
        basePrice: product.basePrice.amount,
        productType: product.productType,
        condition: product.condition,
        status: product.status,
        publishedAt: product.publishedAt,
      },
    ]);

    await this.elasticsearch.getClient().bulk({ operations });
  }
}
