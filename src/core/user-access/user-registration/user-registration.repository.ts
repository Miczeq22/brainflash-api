import { UserRegistration } from './user-registration.aggregate-root';

export interface UserRegistrationRepository {
  insert(userRegistration: UserRegistration): Promise<void>;

  update(userRegistration: UserRegistration): Promise<void>;

  findById(id: string): Promise<UserRegistration>;
}
