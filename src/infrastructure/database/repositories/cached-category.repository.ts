import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../../database/repositories/category.repository';
import { CacheService } from '../../cache/redis/cache.service';
import { ICategoryRepository } from '../../../domain/repositories/category.repository';
import { Category } from '../../../domain/entities/category.entity';

@Injectable()
export class CachedCategoryRepository implements ICategoryRepository {
  constructor(
    private repository: CategoryRepository,
    private cache: CacheService,
  ) {}

  async findById(id: string): Promise<Category | null> {
    return this.repository.findById(id);
  }

  async findBySlug(slug: string): Promise<Category | null> {
    return this.repository.findBySlug(slug);
  }

  async findAll(): Promise<Category[]> {
    const cacheKey = this.cache.categoriesKey();
    const cached = await this.cache.get<any[]>(cacheKey);
    
    if (cached) {
      return cached.map(this.deserialize);
    }

    const categories = await this.repository.findAll();
    await this.cache.set(cacheKey, categories.map(this.serialize), 1800);
    return categories;
  }

  async save(category: Category): Promise<Category> {
    const saved = await this.repository.save(category);
    await this.cache.invalidateCategories();
    return saved;
  }

  private serialize(category: Category): any {
    return {
      id: category.id,
      name: category.name,
      slug: category.slug.toString(),
      description: category.description,
      image: category.image,
      parentId: category.parentId,
      isActive: category.isActive,
      sortOrder: category.sortOrder,
    };
  }

  private deserialize(data: any): Category {
    return Category.create(
      data.id,
      data.name,
      data.description,
      data.image,
      data.parentId,
      data.sortOrder,
    );
  }
}
