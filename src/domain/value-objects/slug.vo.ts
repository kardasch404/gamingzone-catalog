import { InvalidSlugException } from '../exceptions/domain.exception';

export class Slug {
  private readonly value: string;

  constructor(value: string) {
    this.value = Slug.generate(value);
  }

  static generate(text: string): string {
    if (!text || text.trim().length === 0) {
      throw new InvalidSlugException('Slug cannot be empty');
    }

    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  toString(): string {
    return this.value;
  }
}
