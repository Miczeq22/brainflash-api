import { User } from './user.aggregate-root';

export interface UserRepository {
  findById(id: string): Promise<User | null>;

  findByEmail(email: string): Promise<User | null>;

  update(user: User): Promise<void>;
}
