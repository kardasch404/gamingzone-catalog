import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { CachedCategoryRepository } from '../../../infrastructure/database/repositories/cached-category.repository';
import { Category } from '../../../domain/entities/category.entity';

@Injectable({ scope: Scope.REQUEST })
export class CategoryDataLoader {
  private loader: DataLoader<string, Category | null>;

  constructor(private categoryRepository: CachedCategoryRepository) {
    this.loader = new DataLoader<string, Category | null>(
      async (ids: readonly string[]) => {
        const categories = await Promise.all(
          ids.map(id => this.categoryRepository.findById(id))
        );
        return categories;
      },
      { cache: true }
    );
  }

  load(id: string): Promise<Category | null> {
    return this.loader.load(id);
  }

  loadMany(ids: string[]): Promise<(Category | null)[]> {
    return this.loader.loadMany(ids);
  }
}
