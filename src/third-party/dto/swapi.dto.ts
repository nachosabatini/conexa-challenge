import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsString,
  IsUrl,
  IsNumber,
} from 'class-validator';

export class FilmDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNumber()
  episode_id: number;

  @ApiProperty()
  @IsString()
  opening_crawl: string;

  @ApiProperty()
  @IsString()
  director: string;

  @ApiProperty()
  @IsString()
  producer: string;

  @ApiProperty()
  @IsDateString()
  release_date: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsUrl({}, { each: true })
  characters: string[];

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsUrl({}, { each: true })
  planets: string[];

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsUrl({}, { each: true })
  starships: string[];

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsUrl({}, { each: true })
  vehicles: string[];

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsUrl({}, { each: true })
  species: string[];

  @ApiProperty()
  @IsDateString()
  created: string;

  @ApiProperty()
  @IsDateString()
  edited: string;

  @ApiProperty()
  @IsUrl()
  url: string;
}
