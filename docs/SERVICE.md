# Gaming Zone Catalog Service

Microservice for managing gaming products catalog with GraphQL, REST, and gRPC support.

## Architecture

Clean Architecture with layers:
- **Domain**: Entities, value objects, repository interfaces
- **Application**: Use cases, DTOs
- **Infrastructure**: Database, cache, search, messaging implementations
- **Presentation**: Controllers, resolvers, gRPC handlers

## Tech Stack

- **Framework**: NestJS 10
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis (ioredis)
- **Search**: Elasticsearch
- **API**: REST (Swagger), GraphQL (Apollo), gRPC
- **Logger**: Winston

## Setup

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Start development
npm run start:dev
```

## Environment Variables

```
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/gamingzone_catalog
REDIS_HOST=localhost
REDIS_PORT=6379
ELASTICSEARCH_NODE=http://localhost:9200
GRPC_PORT=50051
```

## API Endpoints

- REST API: `http://localhost:3000`
- Swagger: `http://localhost:3000/api`
- GraphQL: `http://localhost:3000/graphql`
- Health: `http://localhost:3000/health`

## Scripts

```bash
npm run build          # Build production
npm run start:dev      # Development mode
npm run start:prod     # Production mode
npm run lint           # Lint code
npm run test           # Run tests
npm run prisma:studio  # Open Prisma Studio
```

## Project Structure

```
src/
├── application/       # Use cases and DTOs
├── domain/           # Business entities and interfaces
├── infrastructure/   # External services implementation
│   ├── database/    # Prisma
│   ├── cache/       # Redis
│   ├── search/      # Elasticsearch
│   └── config/      # Configuration
└── presentation/     # API layer
    ├── controllers/ # REST endpoints
    ├── resolvers/   # GraphQL
    └── grpc/        # gRPC services
```
