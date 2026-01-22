import { Slug } from '../../../src/domain/value-objects/slug.vo';
import { InvalidSlugException } from '../../../src/domain/exceptions/domain.exception';

describe('Slug Value Object', () => {
  it('should generate slug from text', () => {
    const slug = new Slug('God of War Ragnarok');
    expect(slug.toString()).toBe('god-of-war-ragnarok');
  });

  it('should handle special characters', () => {
    const slug = new Slug('PlayStation 5 - Digital Edition!');
    expect(slug.toString()).toBe('playstation-5-digital-edition');
  });

  it('should throw error for empty string', () => {
    expect(() => new Slug('')).toThrow(InvalidSlugException);
  });
});
