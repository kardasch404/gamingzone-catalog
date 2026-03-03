import { IsString, IsNumber, IsEnum, IsOptional, Min } from 'class-validator';
import { ProductType, Condition } from '../../../domain/entities/product.entity';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  shortDescription?: string;

  @IsString()
  @IsOptional()
  fullDescription?: string;

  @IsNumber()
  @IsOptional()
  @Min(0.01)
  basePrice?: number;

  @IsNumber()
  @IsOptional()
  comparePrice?: number;

  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsString()
  @IsOptional()
  platformId?: string;

  @IsEnum(ProductType)
  @IsOptional()
  productType?: ProductType;

  @IsEnum(Condition)
  @IsOptional()
  condition?: Condition;
}
