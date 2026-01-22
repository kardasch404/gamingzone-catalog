import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ProductResolver } from './resolvers/product.resolver';
import { CategoryResolver } from './resolvers/category.resolver';
import { CategoryDataLoader } from './loaders/category.loader';
import { DatabaseModule } from '../../infrastructure/database/database.module';
import { RedisModule } from '../../infrastructure/cache/redis.module';
import { ElasticsearchModule } from '../../infrastructure/search/elasticsearch.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
      cache: 'bounded',
      persistedQueries: false,
      context: ({ req }) => ({ req }),
    }),
    DatabaseModule,
    RedisModule,
    ElasticsearchModule,
  ],
  providers: [
    ProductResolver,
    CategoryResolver,
    CategoryDataLoader,
  ],
})
export class GraphqlApiModule {}
