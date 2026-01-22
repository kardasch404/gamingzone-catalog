import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@elastic/elasticsearch';
import { ELASTICSEARCH_CONFIG } from './elasticsearch.config';

@Injectable()
export class ElasticsearchService implements OnModuleInit {
  private client: Client;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    this.client = new Client({
      node: this.configService.get('ELASTICSEARCH_NODE', 'http://localhost:9200'),
    });
    await this.createIndex();
  }

  async createIndex() {
    const exists = await this.client.indices.exists({ index: ELASTICSEARCH_CONFIG.INDEX });
    if (!exists) {
      await this.client.indices.create({
        index: ELASTICSEARCH_CONFIG.INDEX,
        body: {
          settings: ELASTICSEARCH_CONFIG.SETTINGS,
          mappings: ELASTICSEARCH_CONFIG.MAPPINGS,
        },
      });
    }
  }

  getClient(): Client {
    return this.client;
  }
}
