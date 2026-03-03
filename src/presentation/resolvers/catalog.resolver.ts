import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
export class CatalogResolver {
  @Query(() => String)
  hello(): string {
    return 'Hello from Catalog Service';
  }
}
