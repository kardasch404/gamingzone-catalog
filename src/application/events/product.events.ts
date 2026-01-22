export class ProductCreatedEvent {
  constructor(
    public readonly productId: string,
    public readonly sku: string,
    public readonly name: string,
    public readonly categoryId: string,
    public readonly basePrice: number,
  ) {}
}

export class ProductUpdatedEvent {
  constructor(
    public readonly productId: string,
    public readonly changes: Record<string, any>,
  ) {}
}

export class ProductPublishedEvent {
  constructor(
    public readonly productId: string,
    public readonly publishedAt: Date,
  ) {}
}

export class ProductDeletedEvent {
  constructor(public readonly productId: string) {}
}
