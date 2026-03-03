import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { IProductRepository } from '../../../domain/repositories/product.repository';
import { Product, ProductType, Condition, ProductStatus } from '../../../domain/entities/product.entity';
import { Money } from '../../../domain/value-objects/money.vo';
import { Slug } from '../../../domain/value-objects/slug.vo';
import { ProductImage } from '../../../domain/value-objects/product-image.vo';
import { ProductSpecification } from '../../../domain/value-objects/product-specification.vo';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { images: true, specifications: true },
    });
    return product ? this.toDomain(product) : null;
  }

  async findBySku(sku: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { sku },
      include: { images: true, specifications: true },
    });
    return product ? this.toDomain(product) : null;
  }

  async findBySlug(slug: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: { images: true, specifications: true },
    });
    return product ? this.toDomain(product) : null;
  }

  async save(product: Product): Promise<Product> {
    const data = {
      sku: product.sku,
      name: product.name,
      slug: product.slug.toString(),
      shortDescription: product.shortDescription,
      fullDescription: product.fullDescription,
      basePrice: product.basePrice.amount,
      comparePrice: product.comparePrice?.amount,
      currency: product.basePrice.currency,
      categoryId: product.categoryId,
      platformId: product.platformId,
      productType: product.productType,
      condition: product.condition,
      status: product.status,
      isDeleted: product.isDeleted,
      publishedAt: product.publishedAt,
    };

    const saved = await this.prisma.product.upsert({
      where: { id: product.id },
      create: { id: product.id, ...data },
      update: data,
      include: { images: true, specifications: true },
    });

    return this.toDomain(saved);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({ where: { id } });
  }

  private toDomain(data: any): Product {
    return new Product(
      data.id,
      data.sku,
      data.name,
      new Slug(data.slug),
      data.shortDescription,
      data.fullDescription,
      new Money(Number(data.basePrice), data.currency),
      data.comparePrice ? new Money(Number(data.comparePrice), data.currency) : null,
      data.categoryId,
      data.platformId,
      data.productType as ProductType,
      data.condition as Condition,
      data.status as ProductStatus,
      data.images?.map((img: any) => new ProductImage(img.url, img.altText, img.isPrimary, img.sortOrder)) || [],
      data.specifications?.map((spec: any) => new ProductSpecification(spec.key, spec.value, spec.group, spec.sortOrder)) || [],
      data.isDeleted,
      data.publishedAt,
    );
  }
}
