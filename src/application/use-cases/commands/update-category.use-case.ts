import { Injectable } from '@nestjs/common';
import { UpdateCategoryDto } from '../../dtos/request/update-category.dto';
import { CategoryResponseDto } from '../../dtos/response/category-response.dto';
import { CachedCategoryRepository } from '../../../infrastructure/database/repositories/cached-category.repository';
import { Category } from '../../../domain/entities/category.entity';

@Injectable()
export class UpdateCategoryUseCase {
  constructor(private repository: CachedCategoryRepository) {}

  async execute(id: string, dto: UpdateCategoryDto): Promise<CategoryResponseDto> {
    const category = await this.repository.findById(id);
    if (!category) {
      throw new Error('Category not found');
    }

    const updated = new Category(
      category.id,
      dto.name || category.name,
      category.slug,
      dto.description !== undefined ? dto.description : category.description,
      dto.image !== undefined ? dto.image : category.image,
      category.parentId,
      dto.isActive !== undefined ? dto.isActive : category.isActive,
      dto.sortOrder !== undefined ? dto.sortOrder : category.sortOrder,
    );

    const saved = await this.repository.save(updated);
    return this.toDto(saved);
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
