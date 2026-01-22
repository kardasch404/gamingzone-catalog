import { Module } from '@nestjs/common';
import { ElasticsearchService } from './elasticsearch.service';
import { ProductIndexingService } from './product-indexing.service';
import { ProductSearchService } from './product-search.service';
import { ProductSyncListener } from './product-sync.listener';

@Module({
  providers: [
    ElasticsearchService,
    ProductIndexingService,
    ProductSearchService,
    ProductSyncListener,
  ],
  exports: [
    ElasticsearchService,
    ProductIndexingService,
    ProductSearchService,
    ProductSyncListener,
  ],
})
export class ElasticsearchModule {}
