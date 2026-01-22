import { ObjectType, Field, ID, Float, Int, registerEnumType } from '@nestjs/graphql';
import { ProductType, Condition, ProductStatus } from '../../../domain/entities/product.entity';

registerEnumType(ProductType, { name: 'ProductType' });
registerEnumType(Condition, { name: 'Condition' });
registerEnumType(ProductStatus, { name: 'ProductStatus' });

@ObjectType()
export class ProductGQL {
  @Field(() => ID)
  id: string;

  @Field()
  sku: string;

  @Field()
  name: string;

  @Field()
  slug: string;

  @Field({ nullable: true })
  shortDescription?: string;

  @Field()
  fullDescription: string;

  @Field(() => Float)
  basePrice: number;

  @Field(() => Float, { nullable: true })
  comparePrice?: number;

  @Field()
  currency: string;

  @Field(() => CategoryGQL)
  category: CategoryGQL;

  @Field(() => PlatformGQL, { nullable: true })
  platform?: PlatformGQL;

  @Field(() => ProductType)
  productType: ProductType;

  @Field(() => Condition)
  condition: Condition;

  @Field(() => ProductStatus)
  status: ProductStatus;

  @Field(() => Float, { nullable: true })
  averageRating?: number;

  @Field(() => Int)
  reviewCount: number;

  @Field()
  publishedAt?: Date;

  @Field()
  createdAt: Date;
}

@ObjectType()
export class CategoryGQL {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  slug: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  image?: string;

  @Field(() => CategoryGQL, { nullable: true })
  parent?: CategoryGQL;

  @Field(() => [CategoryGQL])
  children: CategoryGQL[];

  @Field(() => Int)
  productCount: number;
}

@ObjectType()
export class PlatformGQL {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  slug: string;

  @Field({ nullable: true })
  image?: string;
}

@ObjectType()
export class PageInfo {
  @Field()
  hasNextPage: boolean;

  @Field()
  hasPreviousPage: boolean;

  @Field({ nullable: true })
  startCursor?: string;

  @Field({ nullable: true })
  endCursor?: string;
}

@ObjectType()
export class ProductEdge {
  @Field(() => ProductGQL)
  node: ProductGQL;

  @Field()
  cursor: string;
}

@ObjectType()
export class ProductConnection {
  @Field(() => [ProductEdge])
  edges: ProductEdge[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;

  @Field(() => Int)
  totalCount: number;
}
