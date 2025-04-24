/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { NotFoundError } from '../utils/errors';
import { CreateMovie, UpdateMovie } from '../models/movie.model';
import * as movieService from '../services/movie.service';
import { jest } from '@jest/globals';

type MockInstance = {
  save: jest.Mock;
  isDeleted: boolean;
  toObject?: jest.Mock;
  _id?: string;
};

jest.mock('../models/movie.mongoose', () => {
  const mockMovieData = {
    _id: '1',
    title: 'Inception',
    description: 'A thief who steals corporate secrets through dream-sharing technology.',
    releaseDate: '2010-07-16',
    genre: 'Action, Sci-Fi',
    rating: 8.8,
    imdbId: 'tt1375666',
    director: '1',
    isDeleted: false
  };

  const mockSavedMovie = {
    toObject: jest.fn().mockReturnValue(mockMovieData)
  };

  const mockMovieInstance: MockInstance = {
    save: jest.fn().mockImplementation(() => Promise.resolve(mockSavedMovie)),
    isDeleted: false
  };

  const MovieModelMock: any = jest.fn().mockImplementation((data: any) => {
    return {
      ...mockMovieInstance,
      ...data
    };
  });

  MovieModelMock.find = jest.fn().mockImplementation((query: any) => {
    if (query && query.isDeleted === false) {
      return Promise.resolve([
        { 
          toObject: jest.fn().mockReturnValue({ 
            _id: '1', 
            title: 'Inception',
            description: 'A thief who steals corporate secrets through dream-sharing technology.',
            releaseDate: '2010-07-16',
            genre: 'Action, Sci-Fi',
            rating: 8.8,
            imdbId: 'tt1375666',
            director: '1',
            isDeleted: false 
          })
        },
        { 
          toObject: jest.fn().mockReturnValue({ 
            _id: '2', 
            title: 'Parasite',
            description: 'A poor family schemes to become employed by a wealthy household.',
            releaseDate: '2019-05-30',
            genre: 'Thriller, Drama',
            rating: 8.5,
            imdbId: 'tt6751668',
            director: '2',
            isDeleted: false 
          })
        }
      ]);
    }
    return Promise.resolve([]);
  });

  MovieModelMock.findById = jest.fn().mockImplementation((id) => {
    if (id === '1') {
      return Promise.resolve({
        ...mockMovieInstance,
        _id: id,
        toObject: jest.fn().mockReturnValue({ ...mockMovieData, _id: id })
      });
    } else if (id === 'deleted-id') {
      return Promise.resolve({
        ...mockMovieInstance,
        _id: id,
        isDeleted: true,
        toObject: jest.fn().mockReturnValue({ ...mockMovieData, _id: id, isDeleted: true })
      });
    }
    return Promise.resolve(null);
  });

  MovieModelMock.deleteOne = jest.fn().mockImplementation(() => Promise.resolve({ deletedCount: 1 }));

  return { MovieModel: MovieModelMock, __esModule: true };
});

const mockCreateMovieData: CreateMovie = {
  title: 'Test Movie',
  description: 'A test movie description',
  releaseDate: '2023-01-01',
  genre: 'Action',
  rating: 8.5,
  imdbId: 'tt1234567',
  director: '1',
  isDeleted: false
};

describe('Movie Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createMovie', () => {
    it('should create a new movie', async () => {
      const result = await movieService.createMovie(mockCreateMovieData);

      expect(result).toHaveProperty('id');
      expect(result.title).toBe('Inception');
      expect(result.description).toBe('A thief who steals corporate secrets through dream-sharing technology.');
      expect(result.genre).toBe('Action, Sci-Fi');
      expect(result.isDeleted).toBe(false);
    });
  });

  describe('getAllMovies', () => {
    it('should return all non-deleted movies', async () => {
      const result = await movieService.getAllMovies();

      // Verify
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
      expect(result[0].id).toBe('1');
      expect(result[0].title).toBe('Inception');
      expect(result[1].id).toBe('2');
      expect(result[1].title).toBe('Parasite');
    });
  });

  describe('getMovieById', () => {
    it('should return a movie when it exists', async () => {
      const result = await movieService.getMovieById('1');

      expect(result).toHaveProperty('id', '1');
      expect(result.title).toBe('Inception');
      expect(result.isDeleted).toBe(false);
    });

    it('should throw NotFoundError when movie does not exist', async () => {
      await expect(movieService.getMovieById('999')).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError when movie is marked as deleted', async () => {
      await expect(movieService.getMovieById('deleted-id')).rejects.toThrow(NotFoundError);
    });
  });

  describe('updateMovie', () => {
    it('should update a movie successfully', async () => {
      const updateData: UpdateMovie = {
        title: 'Updated Title',
        description: 'Updated description',
        genre: 'Drama',
        rating: 9.0,
        releaseDate: '2020-01-01',
        imdbId: 'tt9999999',
        director: '1'
      };

      const result = await movieService.updateMovie('1', updateData);

      expect(result.id).toBe('1');
      expect(result.title).toBe('Inception');
    });

    it('should throw NotFoundError when updating non-existent movie', async () => {
      const updateData: UpdateMovie = {
        title: 'Updated Title',
        description: 'Updated description',
        genre: 'Drama',
        rating: 9.0,
        releaseDate: '2020-01-01',
        imdbId: 'tt9999999',
        director: '1'
      };
      
      await expect(movieService.updateMovie('999', updateData)).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError when updating deleted movie', async () => {
      const updateData: UpdateMovie = {
        title: 'Updated Title',
        description: 'Updated description',
        genre: 'Drama',
        rating: 9.0,
        releaseDate: '2020-01-01',
        imdbId: 'tt9999999',
        director: '1'
      };
      
      await expect(movieService.updateMovie('deleted-id', updateData)).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError when ID is not provided', async () => {
      const updateData: UpdateMovie = {
        title: 'Updated Title',
        description: 'Updated description',
        genre: 'Drama',
        rating: 9.0,
        releaseDate: '2020-01-01',
        imdbId: 'tt9999999',
        director: '1'
      };
      
      // @ts-expect-error deliberately testing invalid input
      await expect(movieService.updateMovie(undefined, updateData)).rejects.toThrow(NotFoundError);
    });
  });

  describe('deleteMovie', () => {
    it('should soft delete a movie successfully', async () => {
      const result = await movieService.deleteMovie('1');

      expect(result).toBe(true);
    });

    it('should perform force delete when specified', async () => {
      const result = await movieService.deleteMovie('1', true);

      expect(result).toBe(true);
    });

    it('should throw NotFoundError when deleting non-existent movie', async () => {
      await expect(movieService.deleteMovie('999')).rejects.toThrow(NotFoundError);
    });
  });
});
