import { AggregateRoot } from '@core/shared/aggregate-root';
import bcrypt from 'bcrypt';
import { UniqueEntityID } from '@core/shared/unique-entity-id';
import { OldPasswordMustBeValidRule } from './rules/old-password-must-be-valid.rule';

interface UserProps {
  password: string;
  status: string;
  username: string;
}

export class User extends AggregateRoot<UserProps> {
  private constructor(props: UserProps, id: UniqueEntityID) {
    super(props, id);
  }

  public static instanceExisting(props: UserProps, id: UniqueEntityID) {
    return new User(props, id);
  }

  public async updatePassword(oldPassword: string, newPassword: string) {
    await User.checkRule(new OldPasswordMustBeValidRule(oldPassword, this.props.password));

    this.props.password = await bcrypt.hash(newPassword, 10);
  }

  public getPassword() {
    return this.props.password;
  }

  public getStatus() {
    return this.props.status;
  }

  public getUsername() {
    return this.props.username;
  }
}
