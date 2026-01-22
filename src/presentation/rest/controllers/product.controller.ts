import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CreateProductDto } from '../../../application/dtos/request/create-product.dto';
import { UpdateProductDto } from '../../../application/dtos/request/update-product.dto';
import { CreateProductUseCase } from '../../../application/use-cases/commands/create-product.use-case';
import { UpdateProductUseCase } from '../../../application/use-cases/commands/update-product.use-case';
import { DeleteProductUseCase } from '../../../application/use-cases/commands/delete-product.use-case';
import { PublishProductUseCase } from '../../../application/use-cases/commands/publish-product.use-case';
import { GetProductQuery } from '../../../application/use-cases/queries/get-product.query';
import { SearchProductsQuery, SearchProductsDto } from '../../../application/use-cases/queries/search-products.query';

@ApiTags('products')
@Controller('api/products')
export class ProductController {
  constructor(
    private createProduct: CreateProductUseCase,
    private updateProduct: UpdateProductUseCase,
    private deleteProduct: DeleteProductUseCase,
    private publishProduct: PublishProductUseCase,
    private getProduct: GetProductQuery,
    private searchProducts: SearchProductsQuery,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List products with pagination and filters' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'platformId', required: false })
  @ApiQuery({ name: 'minPrice', required: false })
  @ApiQuery({ name: 'maxPrice', required: false })
  async list(@Query() query: any) {
    return this.searchProducts.execute({
      query: query.search || '',
      categoryId: query.categoryId,
      platformId: query.platformId,
      minPrice: query.minPrice ? Number(query.minPrice) : undefined,
      maxPrice: query.maxPrice ? Number(query.maxPrice) : undefined,
      condition: query.condition,
      productType: query.productType,
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 20,
    });
  }

  @Get('search')
  @ApiOperation({ summary: 'Full-text search products' })
  async search(@Query('q') query: string, @Query() filters: any) {
    return this.searchProducts.execute({
      query,
      categoryId: filters.categoryId,
      platformId: filters.platformId,
      minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
      maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
      page: filters.page ? Number(filters.page) : 1,
      limit: filters.limit ? Number(filters.limit) : 20,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  async getById(@Param('id') id: string) {
    return this.getProduct.byId(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get product by slug' })
  async getBySlug(@Param('slug') slug: string) {
    return this.getProduct.bySlug(slug);
  }

  @Post()
  @ApiOperation({ summary: 'Create product' })
  async create(@Body(ValidationPipe) dto: CreateProductDto) {
    return this.createProduct.execute(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update product' })
  async update(@Param('id') id: string, @Body(ValidationPipe) dto: UpdateProductDto) {
    return this.updateProduct.execute(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete product (soft delete)' })
  async delete(@Param('id') id: string) {
    await this.deleteProduct.execute(id);
    return { message: 'Product deleted successfully' };
  }

  @Post(':id/publish')
  @ApiOperation({ summary: 'Publish product' })
  async publish(@Param('id') id: string) {
    return this.publishProduct.execute(id);
  }
}
