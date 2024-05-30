import { IsString, Length, Max, Min } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@Index(['title'], { unique: true })
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Length(1, 100)
  title: string;

  @Column()
  @IsString()
  description: string;

  @Column()
  @IsString()
  @Length(1, 255)
  director: string;

  @Column()
  @Min(1888)
  @Max(new Date().getFullYear())
  releaseDate: number;

  @CreateDateColumn()
  createdAt: Date;
}
