import { Product, ProductType, Condition, ProductStatus } from '../../../src/domain/entities/product.entity';
import { Money } from '../../../src/domain/value-objects/money.vo';
import { InvalidPriceException, ProductNotPublishableException } from '../../../src/domain/exceptions/domain.exception';

describe('Product Entity', () => {
  it('should create product with valid data', () => {
    const product = Product.create(
      '1',
      'SKU-001',
      'God of War',
      'Epic action game',
      new Money(599),
      'cat-1',
      ProductType.GAME,
      Condition.NEW,
    );

    expect(product.name).toBe('God of War');
    expect(product.status).toBe(ProductStatus.DRAFT);
  });

  it('should throw error if base price is zero', () => {
    expect(() => {
      Product.create(
        '1',
        'SKU-001',
        'God of War',
        'Epic action game',
        new Money(0),
        'cat-1',
        ProductType.GAME,
        Condition.NEW,
      );
    }).toThrow(InvalidPriceException);
  });

  it('should throw error if compare price is less than base price', () => {
    expect(() => {
      Product.create(
        '1',
        'SKU-001',
        'God of War',
        'Epic action game',
        new Money(599),
        'cat-1',
        ProductType.GAME,
        Condition.NEW,
        null,
        new Money(499),
      );
    }).toThrow(InvalidPriceException);
  });

  it('should not publish product without images', () => {
    const product = Product.create(
      '1',
      'SKU-001',
      'God of War',
      'Epic action game',
      new Money(599),
      'cat-1',
      ProductType.GAME,
      Condition.NEW,
    );

    expect(() => product.publish()).toThrow(ProductNotPublishableException);
  });

  it('should soft delete product', () => {
    const product = Product.create(
      '1',
      'SKU-001',
      'God of War',
      'Epic action game',
      new Money(599),
      'cat-1',
      ProductType.GAME,
      Condition.NEW,
    );

    const deleted = product.softDelete();
    expect(deleted.isDeleted).toBe(true);
  });
});
