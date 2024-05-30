import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Role } from 'src/config/role.enum';

export class UserDto {
  @ApiProperty()
  id: number = 0;

  @ApiProperty()
  @IsString()
  email: string = '';

  @ApiProperty({ enum: [Role], isArray: true })
  @IsEnum(Role, { each: true })
  @IsOptional()
  roles: Role[] = [Role.User];
}

export class CreateUserDto extends OmitType(UserDto, ['id'] as const) {
  @ApiProperty()
  @IsString()
  password: string = '';
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
