import { Money } from '../value-objects/money.vo';
import { Slug } from '../value-objects/slug.vo';
import { ProductImage } from '../value-objects/product-image.vo';
import { ProductSpecification } from '../value-objects/product-specification.vo';
import {
  InvalidPriceException,
  ProductNotPublishableException,
  InvalidStatusTransitionException,
} from '../exceptions/domain.exception';

export enum ProductType {
  GAME = 'GAME',
  CONSOLE = 'CONSOLE',
  ACCESSORY = 'ACCESSORY',
  DIGITAL_CODE = 'DIGITAL_CODE',
  MERCHANDISE = 'MERCHANDISE',
}

export enum Condition {
  NEW = 'NEW',
  USED = 'USED',
  REFURBISHED = 'REFURBISHED',
  DIGITAL = 'DIGITAL',
}

export enum ProductStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  ARCHIVED = 'ARCHIVED',
}

export class Product {
  constructor(
    public readonly id: string,
    public readonly sku: string,
    public readonly name: string,
    public readonly slug: Slug,
    public readonly shortDescription: string | null,
    public readonly fullDescription: string,
    public readonly basePrice: Money,
    public readonly comparePrice: Money | null,
    public readonly categoryId: string,
    public readonly platformId: string | null,
    public readonly productType: ProductType,
    public readonly condition: Condition,
    public readonly status: ProductStatus,
    public readonly images: ProductImage[],
    public readonly specifications: ProductSpecification[],
    public readonly isDeleted: boolean = false,
    public readonly publishedAt: Date | null = null,
  ) {
    this.validatePricing();
  }

  private validatePricing(): void {
    if (this.basePrice.amount <= 0) {
      throw new InvalidPriceException('Base price must be greater than 0');
    }
    if (this.comparePrice && !this.comparePrice.isGreaterThanOrEqual(this.basePrice)) {
      throw new InvalidPriceException('Compare price must be greater than or equal to base price');
    }
  }

  canPublish(): boolean {
    return this.images.length > 0 && this.status === ProductStatus.DRAFT;
  }

  publish(): Product {
    if (!this.canPublish()) {
      throw new ProductNotPublishableException('Product must have at least 1 image to be published');
    }
    return new Product(
      this.id,
      this.sku,
      this.name,
      this.slug,
      this.shortDescription,
      this.fullDescription,
      this.basePrice,
      this.comparePrice,
      this.categoryId,
      this.platformId,
      this.productType,
      this.condition,
      ProductStatus.ACTIVE,
      this.images,
      this.specifications,
      this.isDeleted,
      new Date(),
    );
  }

  changeStatus(newStatus: ProductStatus): Product {
    const validTransitions: Record<ProductStatus, ProductStatus[]> = {
      [ProductStatus.DRAFT]: [ProductStatus.ACTIVE],
      [ProductStatus.ACTIVE]: [ProductStatus.INACTIVE, ProductStatus.OUT_OF_STOCK],
      [ProductStatus.INACTIVE]: [ProductStatus.ACTIVE, ProductStatus.ARCHIVED],
      [ProductStatus.OUT_OF_STOCK]: [ProductStatus.ACTIVE],
      [ProductStatus.ARCHIVED]: [],
    };

    if (!validTransitions[this.status].includes(newStatus)) {
      throw new InvalidStatusTransitionException(
        `Cannot transition from ${this.status} to ${newStatus}`,
      );
    }

    return new Product(
      this.id,
      this.sku,
      this.name,
      this.slug,
      this.shortDescription,
      this.fullDescription,
      this.basePrice,
      this.comparePrice,
      this.categoryId,
      this.platformId,
      this.productType,
      this.condition,
      newStatus,
      this.images,
      this.specifications,
      this.isDeleted,
      this.publishedAt,
    );
  }

  softDelete(): Product {
    return new Product(
      this.id,
      this.sku,
      this.name,
      this.slug,
      this.shortDescription,
      this.fullDescription,
      this.basePrice,
      this.comparePrice,
      this.categoryId,
      this.platformId,
      this.productType,
      this.condition,
      this.status,
      this.images,
      this.specifications,
      true,
      this.publishedAt,
    );
  }

  static create(
    id: string,
    sku: string,
    name: string,
    fullDescription: string,
    basePrice: Money,
    categoryId: string,
    productType: ProductType,
    condition: Condition,
    shortDescription: string | null = null,
    comparePrice: Money | null = null,
    platformId: string | null = null,
  ): Product {
    return new Product(
      id,
      sku,
      name,
      new Slug(name),
      shortDescription,
      fullDescription,
      basePrice,
      comparePrice,
      categoryId,
      platformId,
      productType,
      condition,
      ProductStatus.DRAFT,
      [],
      [],
      false,
      null,
    );
  }
}
