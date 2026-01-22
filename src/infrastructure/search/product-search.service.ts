import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from './elasticsearch.service';
import { ELASTICSEARCH_CONFIG } from './elasticsearch.config';

export interface SearchFilters {
  categoryId?: string;
  platformId?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  productType?: string;
}

export interface SearchResult {
  products: any[];
  total: number;
  aggregations?: any;
}

@Injectable()
export class ProductSearchService {
  constructor(private elasticsearch: ElasticsearchService) {}

  async search(
    query: string,
    filters: SearchFilters = {},
    page = 1,
    limit = 20,
  ): Promise<SearchResult> {
    const must: any[] = [
      {
        multi_match: {
          query,
          fields: ['name^3', 'description'],
          fuzziness: 'AUTO',
        },
      },
    ];

    const filter: any[] = [{ term: { status: 'ACTIVE' } }];

    if (filters.categoryId) {
      filter.push({ term: { 'category.id': filters.categoryId } });
    }
    if (filters.platformId) {
      filter.push({ term: { platform: filters.platformId } });
    }
    if (filters.condition) {
      filter.push({ term: { condition: filters.condition } });
    }
    if (filters.productType) {
      filter.push({ term: { productType: filters.productType } });
    }
    if (filters.minPrice || filters.maxPrice) {
      filter.push({
        range: {
          basePrice: {
            gte: filters.minPrice,
            lte: filters.maxPrice,
          },
        },
      });
    }

    const result = await this.elasticsearch.getClient().search({
      index: ELASTICSEARCH_CONFIG.INDEX,
      body: {
        query: { bool: { must, filter } },
        from: (page - 1) * limit,
        size: limit,
        aggs: {
          categories: { terms: { field: 'category.id' } },
          platforms: { terms: { field: 'platform' } },
          priceRanges: {
            range: {
              field: 'basePrice',
              ranges: [
                { to: 200 },
                { from: 200, to: 500 },
                { from: 500, to: 1000 },
                { from: 1000 },
              ],
            },
          },
        },
      },
    });

    return {
      products: result.hits.hits.map(hit => hit._source),
      total: (result.hits.total as any).value,
      aggregations: result.aggregations,
    };
  }

  async autocomplete(query: string, limit = 10): Promise<string[]> {
    const result = await this.elasticsearch.getClient().search({
      index: ELASTICSEARCH_CONFIG.INDEX,
      body: {
        query: {
          match: {
            'name.autocomplete': query,
          },
        },
        size: limit,
        _source: ['name'],
      },
    });

    return result.hits.hits.map(hit => (hit._source as any).name);
  }

  async searchByCategory(categoryId: string, page = 1, limit = 20): Promise<SearchResult> {
    const result = await this.elasticsearch.getClient().search({
      index: ELASTICSEARCH_CONFIG.INDEX,
      body: {
        query: {
          bool: {
            filter: [
              { term: { 'category.id': categoryId } },
              { term: { status: 'ACTIVE' } },
            ],
          },
        },
        from: (page - 1) * limit,
        size: limit,
        sort: [{ publishedAt: 'desc' }],
      },
    });

    return {
      products: result.hits.hits.map(hit => hit._source),
      total: (result.hits.total as any).value,
    };
  }
}
