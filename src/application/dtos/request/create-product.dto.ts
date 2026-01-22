import { IsString, IsNumber, IsEnum, IsOptional, Min, IsNotEmpty } from 'class-validator';
import { ProductType, Condition } from '../../../domain/entities/product.entity';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  shortDescription?: string;

  @IsString()
  @IsNotEmpty()
  fullDescription: string;

  @IsNumber()
  @Min(0.01)
  basePrice: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  comparePrice?: number;

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsString()
  @IsOptional()
  platformId?: string;

  @IsEnum(ProductType)
  productType: ProductType;

  @IsEnum(Condition)
  condition: Condition;
}
