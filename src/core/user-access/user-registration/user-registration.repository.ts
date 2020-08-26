import { UserRegistration } from './user-registration.aggregate-root';

export interface UserRegistrationRepository {
  insert(userRegistration: UserRegistration): Promise<void>;
}
