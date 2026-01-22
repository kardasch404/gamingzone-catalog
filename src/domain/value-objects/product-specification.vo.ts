export class ProductSpecification {
  constructor(
    public readonly key: string,
    public readonly value: string,
    public readonly group: string | null = null,
    public readonly sortOrder: number = 0,
  ) {}
}
