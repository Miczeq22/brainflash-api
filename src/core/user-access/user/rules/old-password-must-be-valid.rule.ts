import { BusinessRule } from '@core/shared/business-rule';
import bcrypt from 'bcrypt';

export class OldPasswordMustBeValidRule extends BusinessRule {
  message = 'Old password is invalid.';

  constructor(private readonly oldPassword, private readonly hashedPassword: string) {
    super();
  }

  public async isBroken() {
    return !(await bcrypt.compare(this.oldPassword, this.hashedPassword));
  }
}
