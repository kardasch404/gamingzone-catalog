export class DomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class InvalidPriceException extends DomainException {}
export class InvalidSlugException extends DomainException {}
export class ProductNotPublishableException extends DomainException {}
export class InvalidStatusTransitionException extends DomainException {}
