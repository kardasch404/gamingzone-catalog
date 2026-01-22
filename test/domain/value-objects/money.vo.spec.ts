import { Money } from '../../../src/domain/value-objects/money.vo';
import { InvalidPriceException } from '../../../src/domain/exceptions/domain.exception';

describe('Money Value Object', () => {
  it('should create money with valid amount', () => {
    const money = new Money(599, 'MAD');
    expect(money.amount).toBe(599);
    expect(money.currency).toBe('MAD');
  });

  it('should throw error for negative amount', () => {
    expect(() => new Money(-100)).toThrow(InvalidPriceException);
  });

  it('should compare money values', () => {
    const money1 = new Money(599);
    const money2 = new Money(499);
    expect(money1.isGreaterThan(money2)).toBe(true);
  });
});
