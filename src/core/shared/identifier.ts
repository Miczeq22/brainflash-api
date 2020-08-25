export abstract class Identifier<T> {
  constructor(private value: T) {}

  public equals(id: Identifier<T>) {
    if (!id) {
      return false;
    }

    if (!(id instanceof Identifier)) {
      return false;
    }

    return id.value === this.value;
  }

  public getValue() {
    return this.value;
  }
}
