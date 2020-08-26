import { UniqueEntityID } from './unique-entity-id';
import { BusinessRule } from './business-rule';
import { AsyncFunction } from './async-function';
import { BusinessRuleValidationError } from '@errors/business-rule-validation.error';

export abstract class Entity<T> {
  constructor(
    protected readonly props: T,
    protected readonly id: UniqueEntityID = new UniqueEntityID(),
  ) {}

  public static checkRule(rule: BusinessRule): Promise<void> | void {
    if (rule.isBroken instanceof Promise || rule.isBroken instanceof AsyncFunction) {
      return (rule.isBroken() as Promise<boolean>).then((isBroken) => {
        if (isBroken) {
          throw new BusinessRuleValidationError(rule.message);
        }
      });
    }

    if (rule.isBroken()) {
      throw new BusinessRuleValidationError(rule.message);
    }
  }

  public getId() {
    return this.id;
  }

  public equals(object: Entity<T>) {
    if (!object) {
      return false;
    }

    if (!(object instanceof Entity)) {
      return false;
    }

    return this.id.equals(object.id);
  }
}
