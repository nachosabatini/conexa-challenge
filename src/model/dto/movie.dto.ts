import { ApiProperty } from '@nestjs/swagger';

export class MovieDto {
  @ApiProperty()
  title: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  director: string;
  @ApiProperty()
  releaseDate: number;
}
