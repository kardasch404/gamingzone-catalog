import { Injectable } from '@nestjs/common';
import { ProductSearchService, SearchFilters } from '../../../infrastructure/search/product-search.service';

export class SearchProductsDto {
  query: string;
  categoryId?: string;
  platformId?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  productType?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class SearchProductsQuery {
  constructor(private searchService: ProductSearchService) {}

  async execute(dto: SearchProductsDto) {
    const filters: SearchFilters = {
      categoryId: dto.categoryId,
      platformId: dto.platformId,
      minPrice: dto.minPrice,
      maxPrice: dto.maxPrice,
      condition: dto.condition,
      productType: dto.productType,
    };

    return this.searchService.search(
      dto.query,
      filters,
      dto.page || 1,
      dto.limit || 20,
    );
  }

  async autocomplete(query: string) {
    return this.searchService.autocomplete(query);
  }

  async byCategory(categoryId: string, page = 1, limit = 20) {
    return this.searchService.searchByCategory(categoryId, page, limit);
  }
}
