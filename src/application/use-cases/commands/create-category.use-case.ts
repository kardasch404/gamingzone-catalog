import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { CreateCategoryDto } from '../../dtos/request/create-category.dto';
import { CategoryResponseDto } from '../../dtos/response/category-response.dto';
import { CachedCategoryRepository } from '../../../infrastructure/database/repositories/cached-category.repository';
import { Category } from '../../../domain/entities/category.entity';

@Injectable()
export class CreateCategoryUseCase {
  private readonly MAX_DEPTH = 3;

  constructor(private repository: CachedCategoryRepository) {}

  async execute(dto: CreateCategoryDto): Promise<CategoryResponseDto> {
    if (dto.parentId) {
      const depth = await this.getDepth(dto.parentId);
      if (depth >= this.MAX_DEPTH) {
        throw new Error('Maximum category hierarchy depth exceeded');
      }
    }

    const category = Category.create(
      uuid(),
      dto.name,
      dto.description || null,
      dto.image || null,
      dto.parentId || null,
      dto.sortOrder || 0,
    );

    const saved = await this.repository.save(category);
    return this.toDto(saved);
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
