import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ProductCreatedEvent,
  ProductUpdatedEvent,
  ProductDeletedEvent,
  ProductPublishedEvent,
  CategoryCreatedEvent,
  KAFKA_TOPICS,
} from './events.schema';

@Injectable()
export class KafkaEventPublisher {
  private readonly logger = new Logger(KafkaEventPublisher.name);
  private readonly enabled: boolean;

  constructor(private config: ConfigService) {
    this.enabled = this.config.get('KAFKA_ENABLED', 'false') === 'true';
  }

  async publishProductCreated(event: Omit<ProductCreatedEvent, 'eventType' | 'version' | 'timestamp'>) {
    const fullEvent: ProductCreatedEvent = {
      eventType: 'product.created',
      version: '1.0',
      timestamp: new Date().toISOString(),
      ...event,
    };

    await this.publish(KAFKA_TOPICS.PRODUCT_EVENTS, fullEvent);
  }

  async publishProductUpdated(event: Omit<ProductUpdatedEvent, 'eventType' | 'version' | 'timestamp'>) {
    const fullEvent: ProductUpdatedEvent = {
      eventType: 'product.updated',
      version: '1.0',
      timestamp: new Date().toISOString(),
      ...event,
    };

    await this.publish(KAFKA_TOPICS.PRODUCT_EVENTS, fullEvent);
  }

  async publishProductDeleted(event: Omit<ProductDeletedEvent, 'eventType' | 'version' | 'timestamp'>) {
    const fullEvent: ProductDeletedEvent = {
      eventType: 'product.deleted',
      version: '1.0',
      timestamp: new Date().toISOString(),
      ...event,
    };

    await this.publish(KAFKA_TOPICS.PRODUCT_EVENTS, fullEvent);
  }

  async publishProductPublished(event: Omit<ProductPublishedEvent, 'eventType' | 'version' | 'timestamp'>) {
    const fullEvent: ProductPublishedEvent = {
      eventType: 'product.published',
      version: '1.0',
      timestamp: new Date().toISOString(),
      ...event,
    };

    await this.publish(KAFKA_TOPICS.PRODUCT_EVENTS, fullEvent);
  }

  async publishCategoryCreated(event: Omit<CategoryCreatedEvent, 'eventType' | 'version' | 'timestamp'>) {
    const fullEvent: CategoryCreatedEvent = {
      eventType: 'category.created',
      version: '1.0',
      timestamp: new Date().toISOString(),
      ...event,
    };

    await this.publish(KAFKA_TOPICS.CATEGORY_EVENTS, fullEvent);
  }

  private async publish(topic: string, event: any) {
    if (!this.enabled) {
      this.logger.debug(`Kafka disabled. Would publish to ${topic}:`, event);
      return;
    }

    try {
      this.logger.log(`Publishing event to ${topic}:`, event.eventType);
      // TODO: Implement actual Kafka producer
      // await this.kafkaProducer.send({
      //   topic,
      //   messages: [{ key: event.data.productId || event.data.categoryId, value: JSON.stringify(event) }],
      // });
    } catch (error) {
      this.logger.error(`Failed to publish event to ${topic}:`, error);
      throw error;
    }
  }
}
