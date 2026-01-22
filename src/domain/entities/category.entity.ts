import { Slug } from '../value-objects/slug.vo';

export class Category {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly slug: Slug,
    public readonly description: string | null,
    public readonly image: string | null,
    public readonly parentId: string | null,
    public readonly isActive: boolean,
    public readonly sortOrder: number,
  ) {}

  static create(
    id: string,
    name: string,
    description: string | null = null,
    image: string | null = null,
    parentId: string | null = null,
    sortOrder: number = 0,
  ): Category {
    return new Category(
      id,
      name,
      new Slug(name),
      description,
      image,
      parentId,
      true,
      sortOrder,
    );
  }
}
