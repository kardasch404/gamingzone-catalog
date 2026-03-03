import { Resolver, Subscription, Args, ID } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { ProductGQL } from '../types/product.types';
import { Injectable } from '@nestjs/common';

const pubSub = new PubSub();

export const PRODUCT_UPDATED = 'productUpdated';
export const PRODUCT_PRICE_CHANGED = 'productPriceChanged';

@Injectable()
export class ProductSubscriptionService {
  publishProductUpdated(product: any) {
    pubSub.publish(PRODUCT_UPDATED, { productUpdated: product });
  }

  publishPriceChanged(product: any) {
    pubSub.publish(PRODUCT_PRICE_CHANGED, { productPriceChanged: product });
  }
}

@Resolver()
export class ProductSubscriptionResolver {
  @Subscription(() => ProductGQL, {
    filter: (payload, variables) => {
      if (!variables.productId) return true;
      return payload.productUpdated.id === variables.productId;
    },
  })
  productUpdated(@Args('productId', { type: () => ID, nullable: true }) productId?: string) {
    return pubSub.asyncIterator(PRODUCT_UPDATED);
  }

  @Subscription(() => ProductGQL, {
    filter: (payload, variables) => {
      if (!variables.productId) return true;
      return payload.productPriceChanged.id === variables.productId;
    },
  })
  productPriceChanged(@Args('productId', { type: () => ID, nullable: true }) productId?: string) {
    return pubSub.asyncIterator(PRODUCT_PRICE_CHANGED);
  }
}
