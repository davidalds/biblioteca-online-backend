import { UserRole } from 'src/types/userRole';

export class AuthType {
  email: string;
  password: string;
  user_type: UserRole;
}
