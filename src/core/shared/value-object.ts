import { AsyncFunction } from './async-function';
import { BusinessRule } from './business-rule';
import { BusinessRuleValidationError } from '@errors/business-rule-validation.error';

export abstract class ValueObject<T extends object> {
  constructor(public readonly props: T) {}

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

  public equals(object: ValueObject<T>) {
    if (!object) {
      return false;
    }

    if (!object.props) {
      return false;
    }

    return JSON.stringify(this.props) === JSON.stringify(object.props);
  }
}
