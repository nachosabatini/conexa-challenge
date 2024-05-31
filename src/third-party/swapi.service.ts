// src/third-party/swapi.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { FilmDto } from './dto/swapi.dto';

@Injectable()
export class SwapiService {
  private readonly baseURL: string = 'https://swapi.dev/api/films';

  async getAllFilms(): Promise<FilmDto[]> {
    try {
      const response: AxiosResponse = await axios.get(`${this.baseURL}/`);
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Error fetching films from SWAPI',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async getFilmById(id: number): Promise<FilmDto> {
    try {
      const response: AxiosResponse = await axios.get(`${this.baseURL}/${id}/`);
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Error fetching film with id ${id} from SWAPI`,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
