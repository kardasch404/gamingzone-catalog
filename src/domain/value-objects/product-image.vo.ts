export class ProductImage {
  constructor(
    public readonly url: string,
    public readonly altText: string | null = null,
    public readonly isPrimary: boolean = false,
    public readonly sortOrder: number = 0,
  ) {}
}
