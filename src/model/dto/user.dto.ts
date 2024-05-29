import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Role } from 'src/config/role.enum';

export class UserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: [Role], isArray: true })
  roles: Role[];
}

export class CreateUserDto extends OmitType(UserDto, ['id'] as const) {
  @ApiProperty()
  password: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
