import { InvalidPriceException } from '../exceptions/domain.exception';

export class Money {
  constructor(
    public readonly amount: number,
    public readonly currency: string = 'MAD',
  ) {
    if (amount < 0) {
      throw new InvalidPriceException('Price cannot be negative');
    }
  }

  isGreaterThan(other: Money): boolean {
    return this.amount > other.amount;
  }

  isGreaterThanOrEqual(other: Money): boolean {
    return this.amount >= other.amount;
  }
}
