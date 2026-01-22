import { Resolver, Query, Mutation, Args, ID, ResolveField, Parent } from '@nestjs/graphql';
import { ProductGQL, CategoryGQL, ProductConnection } from '../types/product.types';
import { CreateProductUseCase } from '../../../application/use-cases/commands/create-product.use-case';
import { UpdateProductUseCase } from '../../../application/use-cases/commands/update-product.use-case';
import { DeleteProductUseCase } from '../../../application/use-cases/commands/delete-product.use-case';
import { PublishProductUseCase } from '../../../application/use-cases/commands/publish-product.use-case';
import { GetProductQuery } from '../../../application/use-cases/queries/get-product.query';
import { SearchProductsQuery } from '../../../application/use-cases/queries/search-products.query';
import { CategoryDataLoader } from '../loaders/category.loader';
import { CreateProductDto } from '../../../application/dtos/request/create-product.dto';

@Resolver(() => ProductGQL)
export class ProductResolver {
  constructor(
    private createProduct: CreateProductUseCase,
    private updateProduct: UpdateProductUseCase,
    private deleteProduct: DeleteProductUseCase,
    private publishProduct: PublishProductUseCase,
    private getProduct: GetProductQuery,
    private searchProducts: SearchProductsQuery,
    private categoryLoader: CategoryDataLoader,
  ) {}

  @Query(() => ProductGQL, { nullable: true })
  async product(
    @Args('id', { type: () => ID, nullable: true }) id?: string,
    @Args('slug', { nullable: true }) slug?: string,
  ) {
    if (id) return this.getProduct.byId(id);
    if (slug) return this.getProduct.bySlug(slug);
    return null;
  }

  @Query(() => ProductConnection)
  async products(
    @Args('page', { nullable: true, defaultValue: 1 }) page: number,
    @Args('limit', { nullable: true, defaultValue: 20 }) limit: number,
    @Args('categoryId', { type: () => ID, nullable: true }) categoryId?: string,
    @Args('platformId', { type: () => ID, nullable: true }) platformId?: string,
    @Args('minPrice', { nullable: true }) minPrice?: number,
    @Args('maxPrice', { nullable: true }) maxPrice?: number,
  ) {
    const result = await this.searchProducts.execute({
      query: '',
      categoryId,
      platformId,
      minPrice,
      maxPrice,
      page,
      limit,
    });

    return {
      edges: result.products.map((p, i) => ({
        node: p,
        cursor: Buffer.from(`${page}:${i}`).toString('base64'),
      })),
      pageInfo: {
        hasNextPage: result.total > page * limit,
        hasPreviousPage: page > 1,
        startCursor: result.products.length > 0 ? Buffer.from(`${page}:0`).toString('base64') : null,
        endCursor: result.products.length > 0 ? Buffer.from(`${page}:${result.products.length - 1}`).toString('base64') : null,
      },
      totalCount: result.total,
    };
  }

  @Query(() => ProductConnection)
  async searchProducts(
    @Args('query') query: string,
    @Args('page', { nullable: true, defaultValue: 1 }) page: number,
    @Args('limit', { nullable: true, defaultValue: 20 }) limit: number,
  ) {
    const result = await this.searchProducts.execute({ query, page, limit });

    return {
      edges: result.products.map((p, i) => ({
        node: p,
        cursor: Buffer.from(`${page}:${i}`).toString('base64'),
      })),
      pageInfo: {
        hasNextPage: result.total > page * limit,
        hasPreviousPage: page > 1,
      },
      totalCount: result.total,
    };
  }

  @Mutation(() => ProductGQL)
  async createProduct(@Args('input') input: CreateProductDto) {
    return this.createProduct.execute(input);
  }

  @Mutation(() => ProductGQL)
  async publishProduct(@Args('id', { type: () => ID }) id: string) {
    return this.publishProduct.execute(id);
  }

  @Mutation(() => Boolean)
  async deleteProduct(@Args('id', { type: () => ID }) id: string) {
    await this.deleteProduct.execute(id);
    return true;
  }

  @ResolveField(() => CategoryGQL)
  async category(@Parent() product: ProductGQL) {
    return this.categoryLoader.load(product.category.id || (product as any).categoryId);
  }
}
