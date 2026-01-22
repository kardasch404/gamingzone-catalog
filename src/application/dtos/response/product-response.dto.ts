export class ProductResponseDto {
  id: string;
  sku: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  fullDescription: string;
  basePrice: number;
  comparePrice: number | null;
  currency: string;
  categoryId: string;
  platformId: string | null;
  productType: string;
  condition: string;
  status: string;
  publishedAt: Date | null;
  createdAt: Date;
}
