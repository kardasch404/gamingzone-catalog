import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { DatabaseModule } from './infrastructure/database/database.module';
import { RedisModule } from './infrastructure/cache/redis.module';
import { ElasticsearchModule } from './infrastructure/search/elasticsearch.module';
import { HealthController } from './presentation/controllers/health.controller';
import { CatalogResolver } from './presentation/resolvers/catalog.resolver';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
    }),
    DatabaseModule,
    RedisModule,
    ElasticsearchModule,
  ],
  controllers: [HealthController],
  providers: [CatalogResolver],
})
export class AppModule {}
