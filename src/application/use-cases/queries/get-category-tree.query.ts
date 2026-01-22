import { Injectable } from '@nestjs/common';
import { CategoryResponseDto } from '../../dtos/response/category-response.dto';
import { CachedCategoryRepository } from '../../../infrastructure/database/repositories/cached-category.repository';
import { Category } from '../../../domain/entities/category.entity';

@Injectable()
export class GetCategoryTreeQuery {
  constructor(private repository: CachedCategoryRepository) {}

  async execute(): Promise<CategoryResponseDto[]> {
    const allCategories = await this.repository.findAll();
    return this.buildTree(allCategories);
  }

  private buildTree(categories: Category[]): CategoryResponseDto[] {
    const categoryMap = new Map<string, CategoryResponseDto>();
    const rootCategories: CategoryResponseDto[] = [];

    categories.forEach(cat => {
      categoryMap.set(cat.id, this.toDto(cat));
    });

    categoryMap.forEach(cat => {
      if (cat.parentId) {
        const parent = categoryMap.get(cat.parentId);
        if (parent) {
          if (!parent.children) {
            parent.children = [];
          }
          parent.children.push(cat);
        }
      } else {
        rootCategories.push(cat);
      }
    });

    return rootCategories;
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
