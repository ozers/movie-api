import {Director} from '../models/director.model';
import { NotFoundError } from '../utils/errors';

const mockDirectors: Director[] = [
    {
        id: '1',
        firstName: 'Christopher',
        lastName: 'Nolan',
        birthDate: '1970-07-30',
        bio: 'Christopher Nolan is a British-American filmmaker known for his complex narratives, philosophical themes, and practical effects.',
        isDeleted: false
    },
    {
        id: '2',
        firstName: 'Bong',
        lastName: 'Joon-ho',
        birthDate: '1969-09-14',
        bio: 'Bong Joon-ho is a South Korean film director, producer and screenwriter known for his emphasis on social themes and genre-mixing.',
        isDeleted: false
    },
    {
        id: '3',
        firstName: 'Damien',
        lastName: 'Chazelle',
        birthDate: '1985-01-19',
        bio: 'Damien Chazelle is an American director and screenwriter known for his musical films and his unique cinematic style.',
        isDeleted: false
    }
];

const directors = [...mockDirectors];

export const createDirector = async (director: Director): Promise<Director> => {
    const id = (directors.length + 1).toString();
    const newDirector: Director = {
        ...director,
        id,
        isDeleted: false
    };

    directors.push(newDirector);
    return newDirector;
};

export const getAllDirectors = async (): Promise<Director[]> => {
    return directors.filter(director => !director.isDeleted);
};

export const getDirectorById = async (id: string): Promise<Director> => {
    const director = directors.find(director => director.id === id);
    if (!director || director.isDeleted) {
        throw new NotFoundError('Director not found');
    }
    return director;
};

export const updateDirector = async (id: string, director: Director): Promise<Director> => {
    const index = directors.findIndex(d => d.id === id && !d.isDeleted);
    if (index === -1) {
        throw new NotFoundError('Director not found');
    }

    const updatedDirector = {
        ...director,
        id,
        isDeleted: false
    };

    directors[index] = updatedDirector;
    return updatedDirector;
};

export const deleteDirector = async (id: string, force: boolean = false): Promise<boolean> => {
    const index = directors.findIndex(d => d.id === id);
    if (index === -1) {
        throw new NotFoundError('Director not found');
    }

    if (force) {
        directors.splice(index, 1);
    } else {
        directors[index] = { ...directors[index], isDeleted: true };
    }

    return true;
};
