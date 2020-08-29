import { AggregateRoot } from '@core/shared/aggregate-root';
import bcrypt from 'bcrypt';
import { UniqueEntityID } from '@core/shared/unique-entity-id';
import { AccountStatus } from './account-status.value-object';
import {
  UserShouldHaveUniqueEmailRule,
  UniqueEmailChecker,
} from './rules/user-should-have-unique-email.rule';
import { UserRegisteredDomainEvent } from './events/user-registered.domain-event';
import { AccountCannotBeExpiredRule } from './rules/account-cannot-be-expired.rule';
import { AccountCannotBeActivatedMoreThanOnceRule } from './rules/account-cannot-be-activated-more-than-once.rule';

interface UserRegistrationProps {
  username: string;
  email: string;
  password: string;
  accountStatus: string;
  registrationDate: Date;
  confirmationDate: Date | null;
}

interface RegisterNewUserProps {
  email: string;
  password: string;
  username: string;
}

export class UserRegistration extends AggregateRoot<UserRegistrationProps> {
  private constructor(props: UserRegistrationProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static async registerNew(
    { email, password, username }: RegisterNewUserProps,
    emailChecker: UniqueEmailChecker,
  ) {
    await UserRegistration.checkRule(new UserShouldHaveUniqueEmailRule(email, emailChecker));

    const userRegistration = new UserRegistration({
      email,
      password,
      username,
      accountStatus: AccountStatus.WaitingForConfirmation.getValue(),
      registrationDate: new Date(),
      confirmationDate: null,
    });

    await userRegistration.hashPassword();

    userRegistration.addDomainEvent(
      new UserRegisteredDomainEvent(email, username, userRegistration.getId().getValue()),
    );

    return userRegistration;
  }

  public static instanceExisting(props: UserRegistrationProps, id: UniqueEntityID) {
    return new UserRegistration(props, id);
  }

  public confirmAccount() {
    UserRegistration.checkRule(new AccountCannotBeExpiredRule(this.props.accountStatus));
    UserRegistration.checkRule(
      new AccountCannotBeActivatedMoreThanOnceRule(this.props.accountStatus),
    );

    this.props.accountStatus = AccountStatus.Confirmed.getValue();
    this.props.confirmationDate = new Date();
  }

  private async hashPassword() {
    this.props.password = await bcrypt.hash(this.props.password, 10);
  }

  public getUsername() {
    return this.props.username;
  }

  public getEmail() {
    return this.props.email;
  }

  public getPassword() {
    return this.props.password;
  }

  public getRegistrationDate() {
    return this.props.registrationDate;
  }

  public getConfirmationDate() {
    return this.props.confirmationDate;
  }

  public getStatus() {
    return this.props.accountStatus;
  }
}
