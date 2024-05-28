import { Role } from 'src/config/role.enum';

export class CreateUserDto {
  email: string;
  password: string;
  roles?: Role[];
}
