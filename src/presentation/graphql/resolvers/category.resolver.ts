import { Resolver, Query, Mutation, Args, ID, ResolveField, Parent, Int } from '@nestjs/graphql';
import { CategoryGQL, ProductConnection } from '../types/product.types';
import { CreateCategoryUseCase } from '../../../application/use-cases/commands/create-category.use-case';
import { UpdateCategoryUseCase } from '../../../application/use-cases/commands/update-category.use-case';
import { DeleteCategoryUseCase } from '../../../application/use-cases/commands/delete-category.use-case';
import { GetCategoryTreeQuery } from '../../../application/use-cases/queries/get-category-tree.query';
import { SearchProductsQuery } from '../../../application/use-cases/queries/search-products.query';
import { CachedCategoryRepository } from '../../../infrastructure/database/repositories/cached-category.repository';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { CreateCategoryDto } from '../../../application/dtos/request/create-category.dto';

@Resolver(() => CategoryGQL)
export class CategoryResolver {
  constructor(
    private createCategory: CreateCategoryUseCase,
    private updateCategory: UpdateCategoryUseCase,
    private deleteCategory: DeleteCategoryUseCase,
    private getCategoryTree: GetCategoryTreeQuery,
    private searchProducts: SearchProductsQuery,
    private categoryRepository: CachedCategoryRepository,
    private prisma: PrismaService,
  ) {}

  @Query(() => CategoryGQL, { nullable: true })
  async category(
    @Args('id', { type: () => ID, nullable: true }) id?: string,
    @Args('slug', { nullable: true }) slug?: string,
  ) {
    if (id) return this.categoryRepository.findById(id);
    if (slug) return this.categoryRepository.findBySlug(slug);
    return null;
  }

  @Query(() => [CategoryGQL])
  async categories() {
    return this.categoryRepository.findAll();
  }

  @Query(() => [CategoryGQL])
  async categoryTree() {
    return this.getCategoryTree.execute();
  }

  @Mutation(() => CategoryGQL)
  async createCategory(@Args('input') input: CreateCategoryDto) {
    return this.createCategory.execute(input);
  }

  @Mutation(() => Boolean)
  async deleteCategory(@Args('id', { type: () => ID }) id: string) {
    await this.deleteCategory.execute(id);
    return true;
  }

  @ResolveField(() => ProductConnection)
  async products(
    @Parent() category: CategoryGQL,
    @Args('page', { nullable: true, defaultValue: 1 }) page: number,
    @Args('limit', { nullable: true, defaultValue: 20 }) limit: number,
  ) {
    const result = await this.searchProducts.byCategory(category.id, page, limit);

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

  @ResolveField(() => Int)
  async productCount(@Parent() category: CategoryGQL) {
    return this.prisma.product.count({
      where: { categoryId: category.id, isDeleted: false },
    });
  }
}
