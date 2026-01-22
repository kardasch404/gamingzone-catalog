import { Injectable } from '@nestjs/common';
import { CategoryResponseDto } from '../../dtos/response/category-response.dto';
import { CachedCategoryRepository } from '../../../infrastructure/database/repositories/cached-category.repository';
import { Category } from '../../../domain/entities/category.entity';

@Injectable()
export class MoveCategoryUseCase {
  private readonly MAX_DEPTH = 3;

  constructor(private repository: CachedCategoryRepository) {}

  async execute(categoryId: string, newParentId: string | null): Promise<CategoryResponseDto> {
    const category = await this.repository.findById(categoryId);
    if (!category) {
      throw new Error('Category not found');
    }

    if (newParentId) {
      if (newParentId === categoryId) {
        throw new Error('Category cannot be its own parent');
      }

      if (await this.wouldCreateCircular(categoryId, newParentId)) {
        throw new Error('Circular reference detected');
      }

      const depth = await this.getDepth(newParentId);
      if (depth >= this.MAX_DEPTH) {
        throw new Error('Maximum category hierarchy depth exceeded');
      }
    }

    const moved = new Category(
      category.id,
      category.name,
      category.slug,
      category.description,
      category.image,
      newParentId,
      category.isActive,
      category.sortOrder,
    );

    const saved = await this.repository.save(moved);
    return this.toDto(saved);
  }

  private async wouldCreateCircular(categoryId: string, newParentId: string): Promise<boolean> {
    let currentId: string | null = newParentId;
    const visited = new Set<string>();
    
    while (currentId) {
      if (currentId === categoryId) {
        return true;
      }
      if (visited.has(currentId)) {
        return false;
      }
      visited.add(currentId);
      const parent = await this.repository.findById(currentId);
      currentId = parent?.parentId || null;
    }
    return false;
  }

  private async getDepth(categoryId: string, depth = 1): Promise<number> {
    const category = await this.repository.findById(categoryId);
    if (!category || !category.parentId) {
      return depth;
    }
    return this.getDepth(category.parentId, depth + 1);
  }

  private toDto(category: Category): CategoryResponseDto {
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
}
