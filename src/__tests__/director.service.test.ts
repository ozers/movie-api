/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { NotFoundError } from '../utils/errors';
import { CreateDirector, UpdateDirector } from '../models/director.model';
import * as directorService from '../services/director.service';
import { jest } from '@jest/globals';

// Mock redis client
jest.mock('../utils/redis.client', () => {
  return {
    getCache: jest.fn().mockImplementation(() => Promise.resolve(null)),
    setCache: jest.fn().mockImplementation(() => Promise.resolve()),
    deleteCache: jest.fn().mockImplementation(() => Promise.resolve()),
    flushCache: jest.fn().mockImplementation(() => Promise.resolve()),
    connectRedis: jest.fn().mockImplementation(() => Promise.resolve()),
    disconnectRedis: jest.fn().mockImplementation(() => Promise.resolve()),
    redisClient: {
      isOpen: true,
      on: jest.fn(),
      connect: jest.fn().mockImplementation((): any => Promise.resolve()),
      disconnect: jest.fn().mockImplementation((): any => Promise.resolve())
    }
  };
});

type MockInstance = {
  save: jest.Mock;
  isDeleted: boolean;
  toObject?: jest.Mock;
  _id?: string;
};

type DirectorData = {
  _id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  bio: string;
  isDeleted: boolean;
};

jest.mock('../models/director.mongoose', () => {
  const mockDirectorData: DirectorData = {
    _id: '1',
    firstName: 'Christopher',
    lastName: 'Nolan',
    birthDate: '1970-07-30',
    bio: 'Christopher Nolan is a British-American filmmaker.',
    isDeleted: false
  };

  const mockSavedDirector = {
    toObject: jest.fn().mockReturnValue(mockDirectorData)
  };

  const mockDirectorInstance: MockInstance = {
    save: jest.fn().mockImplementation((): any => Promise.resolve(mockSavedDirector)),
    isDeleted: false
  };

  const DirectorModelMock: any = jest.fn().mockImplementation((data: any): any => {
    return {
      ...mockDirectorInstance,
      ...data
    };
  });

  DirectorModelMock.find = jest.fn().mockImplementation((query: any): any => {
    if (query && query.isDeleted === false) {
      return Promise.resolve([
        { 
          toObject: jest.fn().mockReturnValue({ 
            _id: '1', 
            firstName: 'Christopher', 
            lastName: 'Nolan', 
            birthDate: '1970-07-30', 
            bio: 'Christopher Nolan is a British-American filmmaker.', 
            isDeleted: false 
          })
        },
        { 
          toObject: jest.fn().mockReturnValue({ 
            _id: '2', 
            firstName: 'Bong', 
            lastName: 'Joon-ho', 
            birthDate: '1969-09-14', 
            bio: 'Bong Joon-ho is a South Korean film director.', 
            isDeleted: false 
          })
        }
      ]);
    }
    return Promise.resolve([]);
  });

  DirectorModelMock.findById = jest.fn().mockImplementation((id: any): any => {
    if (id === '1') {
      return Promise.resolve({
        ...mockDirectorInstance,
        _id: id,
        toObject: jest.fn().mockReturnValue({ ...mockDirectorData, _id: id })
      });
    } else if (id === 'deleted-id') {
      return Promise.resolve({
        ...mockDirectorInstance,
        _id: id,
        isDeleted: true,
        toObject: jest.fn().mockReturnValue({ ...mockDirectorData, _id: id, isDeleted: true })
      });
    }
    return Promise.resolve(null);
  });

  DirectorModelMock.deleteOne = jest.fn().mockImplementation((): any => Promise.resolve({ deletedCount: 1 }));

  return { DirectorModel: DirectorModelMock, __esModule: true };
});

const mockCreateDirectorData: CreateDirector = {
  firstName: 'Quentin',
  lastName: 'Tarantino',
  birthDate: '1963-03-27',
  bio: 'Quentin Tarantino is an American film director, screenwriter, producer, and actor.',
  isDeleted: false
};

describe('Director Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createDirector', () => {
    it('should create a new director', async () => {
      const result = await directorService.createDirector(mockCreateDirectorData);

      expect(result).toHaveProperty('id');
      expect(result.firstName).toBe('Christopher');
      expect(result.lastName).toBe('Nolan');
      expect(result.birthDate).toBe('1970-07-30');
      expect(result.isDeleted).toBe(false);
    });
  });

  describe('getAllDirectors', () => {
    it('should return all non-deleted directors', async () => {
      const result = await directorService.getAllDirectors();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
      expect(result[0].id).toBe('1');
      expect(result[0].firstName).toBe('Christopher');
      expect(result[1].id).toBe('2');
      expect(result[1].firstName).toBe('Bong');
    });
  });

  describe('getDirectorById', () => {
    it('should return a director when it exists', async () => {
      const result = await directorService.getDirectorById('1');

      expect(result).toHaveProperty('id', '1');
      expect(result.firstName).toBe('Christopher');
      expect(result.isDeleted).toBe(false);
    });

    it('should throw NotFoundError when director does not exist', async () => {
      await expect(directorService.getDirectorById('999')).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError when director is marked as deleted', async () => {
      await expect(directorService.getDirectorById('deleted-id')).rejects.toThrow(NotFoundError);
    });
  });

  describe('updateDirector', () => {
    it('should update a director successfully', async () => {
      const updateData: UpdateDirector = {
        firstName: 'Updated Name',
        lastName: 'Test',
        birthDate: '1980-01-01',
        bio: 'Test bio'
      };

      const result = await directorService.updateDirector('1', updateData);

      expect(result.id).toBe('1');
      expect(result.firstName).toBe('Christopher');
    });

    it('should throw NotFoundError when updating non-existent director', async () => {
      const updateData: UpdateDirector = {
        firstName: 'Updated Name',
        lastName: 'Test',
        birthDate: '1980-01-01',
        bio: 'Test bio'
      };
      
      await expect(directorService.updateDirector('999', updateData)).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError when updating deleted director', async () => {
      const updateData: UpdateDirector = {
        firstName: 'Updated Name',
        lastName: 'Test',
        birthDate: '1980-01-01',
        bio: 'Test bio'
      };
      
      await expect(directorService.updateDirector('deleted-id', updateData)).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError when ID is not provided', async () => {
      const updateData: UpdateDirector = {
        firstName: 'Updated Name',
        lastName: 'Test',
        birthDate: '1980-01-01',
        bio: 'Test bio'
      };
      
      // @ts-expect-error - deliberately testing invalid input
      await expect(directorService.updateDirector(undefined, updateData)).rejects.toThrow(NotFoundError);
    });
  });

  describe('deleteDirector', () => {
    it('should soft delete a director successfully', async () => {
      const result = await directorService.deleteDirector('1');

      expect(result).toBe(true);
    });

    it('should perform force delete when specified', async () => {
      const result = await directorService.deleteDirector('1', true);

      expect(result).toBe(true);
    });

    it('should throw NotFoundError when deleting non-existent director', async () => {
      await expect(directorService.deleteDirector('999')).rejects.toThrow(NotFoundError);
    });
  });
});
