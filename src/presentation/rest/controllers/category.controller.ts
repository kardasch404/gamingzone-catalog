import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateCategoryDto } from '../../../application/dtos/request/create-category.dto';
import { UpdateCategoryDto } from '../../../application/dtos/request/update-category.dto';
import { CreateCategoryUseCase } from '../../../application/use-cases/commands/create-category.use-case';
import { UpdateCategoryUseCase } from '../../../application/use-cases/commands/update-category.use-case';
import { DeleteCategoryUseCase } from '../../../application/use-cases/commands/delete-category.use-case';
import { MoveCategoryUseCase } from '../../../application/use-cases/commands/move-category.use-case';
import { GetCategoryTreeQuery } from '../../../application/use-cases/queries/get-category-tree.query';
import { SearchProductsQuery } from '../../../application/use-cases/queries/search-products.query';
import { CachedCategoryRepository } from '../../../infrastructure/database/repositories/cached-category.repository';

@ApiTags('categories')
@Controller('api/categories')
export class CategoryController {
  constructor(
    private createCategory: CreateCategoryUseCase,
    private updateCategory: UpdateCategoryUseCase,
    private deleteCategory: DeleteCategoryUseCase,
    private moveCategory: MoveCategoryUseCase,
    private getCategoryTree: GetCategoryTreeQuery,
    private searchProducts: SearchProductsQuery,
    private categoryRepository: CachedCategoryRepository,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all categories' })
  async list() {
    return this.categoryRepository.findAll();
  }

  @Get('tree')
  @ApiOperation({ summary: 'Get category tree' })
  async tree() {
    return this.getCategoryTree.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  async getById(@Param('id') id: string) {
    return this.categoryRepository.findById(id);
  }

  @Get(':id/products')
  @ApiOperation({ summary: 'Get products in category' })
  async getProducts(
    @Param('id') id: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.searchProducts.byCategory(id, page || 1, limit || 20);
  }

  @Post()
  @ApiOperation({ summary: 'Create category' })
  async create(@Body(ValidationPipe) dto: CreateCategoryDto) {
    return this.createCategory.execute(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update category' })
  async update(@Param('id') id: string, @Body(ValidationPipe) dto: UpdateCategoryDto) {
    return this.updateCategory.execute(id, dto);
  }

  @Patch(':id/move')
  @ApiOperation({ summary: 'Move category to new parent' })
  async move(@Param('id') id: string, @Body('parentId') parentId: string | null) {
    return this.moveCategory.execute(id, parentId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete category' })
  async delete(@Param('id') id: string) {
    await this.deleteCategory.execute(id);
    return { message: 'Category deleted successfully' };
  }
}
