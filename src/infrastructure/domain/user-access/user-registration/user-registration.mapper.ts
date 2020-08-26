import { UserRegistration } from '@core/user-access/user-registration/user-registration.aggregate-root';

export interface UserRegistrationRecord {
  id: string;
  email: string;
  password: string;
  username: string;
  account_status: string;
  registration_date: string;
  confirmation_date: string | null;
}

export const USER_REGISTRATION_TABLE = 'public.user';

export class UserRegistrationMapper {
  public static toPersistance(userRegistration: UserRegistration): UserRegistrationRecord {
    return {
      id: userRegistration.getId().getValue(),
      email: userRegistration.getEmail(),
      password: userRegistration.getPassword(),
      username: userRegistration.getUsername(),
      account_status: userRegistration.getStatus(),
      registration_date: userRegistration.getRegistrationDate().toISOString(),
      confirmation_date: userRegistration.getConfirmationDate()
        ? userRegistration.getConfirmationDate().toISOString()
        : null,
    };
  }
}
