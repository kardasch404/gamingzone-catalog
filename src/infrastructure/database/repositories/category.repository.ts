import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ICategoryRepository } from '../../../domain/repositories/category.repository';
import { Category } from '../../../domain/entities/category.entity';
import { Slug } from '../../../domain/value-objects/slug.vo';

@Injectable()
export class CategoryRepository implements ICategoryRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Category | null> {
    const category = await this.prisma.category.findUnique({ where: { id } });
    return category ? this.toDomain(category) : null;
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const category = await this.prisma.category.findUnique({ where: { slug } });
    return category ? this.toDomain(category) : null;
  }

  async findAll(): Promise<Category[]> {
    const categories = await this.prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
    return categories.map(this.toDomain);
  }

  async save(category: Category): Promise<Category> {
    const data = {
      name: category.name,
      slug: category.slug.toString(),
      description: category.description,
      image: category.image,
      parentId: category.parentId,
      isActive: category.isActive,
      sortOrder: category.sortOrder,
    };

    const saved = await this.prisma.category.upsert({
      where: { id: category.id },
      create: { id: category.id, ...data },
      update: data,
    });

    return this.toDomain(saved);
  }

  private toDomain(data: any): Category {
    return new Category(
      data.id,
      data.name,
      new Slug(data.slug),
      data.description,
      data.image,
      data.parentId,
      data.isActive,
      data.sortOrder,
    );
  }
}
