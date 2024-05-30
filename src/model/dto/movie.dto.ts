import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class MovieDto {
  @ApiProperty()
  @IsString()
  title: string = '';

  @ApiProperty()
  @IsString()
  description: string = '';

  @ApiProperty()
  @IsString()
  director: string = '';

  @ApiProperty()
  @IsNumber()
  releaseDate: number = 0;
}
