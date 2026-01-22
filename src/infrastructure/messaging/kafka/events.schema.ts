export interface BaseEvent {
  eventType: string;
  version: string;
  timestamp: string;
  correlationId?: string;
}

export interface ProductCreatedEvent extends BaseEvent {
  eventType: 'product.created';
  version: '1.0';
  data: {
    productId: string;
    sku: string;
    name: string;
    slug: string;
    categoryId: string;
    basePrice: number;
    currency: string;
    productType: string;
    condition: string;
    status: string;
  };
}

export interface ProductUpdatedEvent extends BaseEvent {
  eventType: 'product.updated';
  version: '1.0';
  data: {
    productId: string;
    sku: string;
    changes: Record<string, any>;
  };
}

export interface ProductDeletedEvent extends BaseEvent {
  eventType: 'product.deleted';
  version: '1.0';
  data: {
    productId: string;
    sku: string;
    deletedAt: string;
  };
}

export interface ProductPublishedEvent extends BaseEvent {
  eventType: 'product.published';
  version: '1.0';
  data: {
    productId: string;
    sku: string;
    name: string;
    categoryId: string;
    basePrice: number;
    publishedAt: string;
  };
}

export interface CategoryCreatedEvent extends BaseEvent {
  eventType: 'category.created';
  version: '1.0';
  data: {
    categoryId: string;
    name: string;
    slug: string;
    parentId: string | null;
  };
}

export const KAFKA_TOPICS = {
  PRODUCT_EVENTS: 'gamingzone.catalog.product-events',
  CATEGORY_EVENTS: 'gamingzone.catalog.category-events',
  DLQ: 'gamingzone.catalog.dlq',
};
