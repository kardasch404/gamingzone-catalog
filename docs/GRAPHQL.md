# GraphQL API Documentation

## Overview

The Gaming Zone Catalog GraphQL API provides a flexible interface for querying and mutating product catalog data.

## Endpoint

```
http://localhost:3000/graphql
```

GraphQL Playground: `http://localhost:3000/graphql`

## Features

- **Type-safe queries** - Strong typing with GraphQL schema
- **Flexible data fetching** - Request exactly what you need
- **N+1 query prevention** - DataLoader batching and caching
- **Real-time updates** - WebSocket subscriptions
- **Field-level caching** - Apollo Server cache
- **Pagination** - Cursor-based pagination with connections

## Example Queries

### Get Product by ID

```graphql
query GetProduct {
  product(id: "uuid") {
    id
    name
    slug
    basePrice
    category {
      name
      slug
    }
    platform {
      name
    }
  }
}
```

### Search Products

```graphql
query SearchProducts {
  searchProducts(query: "god of war", page: 1, limit: 20) {
    edges {
      node {
        id
        name
        basePrice
        averageRating
      }
      cursor
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    totalCount
  }
}
```

### List Products with Filters

```graphql
query ListProducts {
  products(
    categoryId: "cat-uuid"
    platformId: "platform-uuid"
    minPrice: 100
    maxPrice: 500
    page: 1
    limit: 20
  ) {
    edges {
      node {
        id
        name
        basePrice
      }
    }
    totalCount
  }
}
```

### Get Category Tree

```graphql
query CategoryTree {
  categoryTree {
    id
    name
    slug
    children {
      id
      name
      productCount
    }
  }
}
```

### Get Category with Products

```graphql
query CategoryProducts {
  category(slug: "ps5-games") {
    id
    name
    productCount
    products(page: 1, limit: 10) {
      edges {
        node {
          id
          name
          basePrice
        }
      }
      totalCount
    }
  }
}
```

## Mutations

### Create Product

```graphql
mutation CreateProduct {
  createProduct(input: {
    sku: "SKU-001"
    name: "God of War Ragnarok"
    fullDescription: "Epic action game"
    basePrice: 599
    categoryId: "cat-uuid"
    productType: GAME
    condition: NEW
  }) {
    id
    name
    slug
    status
  }
}
```

### Publish Product

```graphql
mutation PublishProduct {
  publishProduct(id: "product-uuid") {
    id
    status
    publishedAt
  }
}
```

### Create Category

```graphql
mutation CreateCategory {
  createCategory(input: {
    name: "PS5 Games"
    description: "Games for PlayStation 5"
    parentId: "parent-uuid"
  }) {
    id
    name
    slug
  }
}
```

## Subscriptions

### Subscribe to Product Updates

```graphql
subscription ProductUpdates {
  productUpdated(productId: "uuid") {
    id
    name
    basePrice
    status
  }
}
```

### Subscribe to Price Changes

```graphql
subscription PriceChanges {
  productPriceChanged(productId: "uuid") {
    id
    name
    basePrice
    comparePrice
  }
}
```

## DataLoader Optimization

The API uses DataLoader to batch and cache database queries:

- **Category loading** - Batches category lookups for product lists
- **Image loading** - Batches image queries
- **Request-scoped caching** - Prevents duplicate queries within a request

## Performance

- Field-level caching with Apollo Server
- Query complexity limits
- Depth limiting
- Rate limiting (configured per client)

## Error Handling

GraphQL errors include:
- `message` - Human-readable error message
- `extensions.code` - Error code (UNAUTHENTICATED, FORBIDDEN, BAD_USER_INPUT, etc.)
- `path` - Field path where error occurred
