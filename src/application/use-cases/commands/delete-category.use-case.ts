import { Injectable } from '@nestjs/common';
import { CachedCategoryRepository } from '../../../infrastructure/database/repositories/cached-category.repository';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

@Injectable()
export class DeleteCategoryUseCase {
  constructor(
    private repository: CachedCategoryRepository,
    private prisma: PrismaService,
  ) {}

  async execute(id: string): Promise<void> {
    const category = await this.repository.findById(id);
    if (!category) {
      throw new Error('Category not found');
    }

    const productCount = await this.prisma.product.count({
      where: { categoryId: id, isDeleted: false },
    });

    if (productCount > 0) {
      throw new Error('Cannot delete category with active products');
    }

    const childCount = await this.prisma.category.count({
      where: { parentId: id },
    });

    if (childCount > 0) {
      throw new Error('Cannot delete category with subcategories');
    }

    await this.prisma.category.delete({ where: { id } });
  }
}
