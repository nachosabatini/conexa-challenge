import { Role } from 'src/config/role.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';
import { IsEmail, IsString, Length, IsEnum } from 'class-validator';

@Entity()
@Index(['email'], { unique: true })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsEmail()
  @Length(1, 255)
  email: string;

  @Column()
  @IsString()
  @Length(8, 255)
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.User })
  @IsEnum(Role, { each: true })
  roles: Role[];

  @CreateDateColumn()
  createdAt: Date;
}
