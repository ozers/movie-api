import { Movie } from '../models/movie.model';
import { NotFoundError } from '../utils/errors';

const mockMovies: Array<Movie> = [
    {
        id: "1",
        title: "Inception",
        description: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.",
        releaseDate: "2010-07-16",
        genre: "Action, Sci-Fi",
        rating: 8.8,
        imdbId: "tt1375666",
        director: "Christopher Nolan",
        isDeleted: false
    },
    {
        id: "2",
        title: "Parasite",
        description: "A poor family schemes to become employed by a wealthy household by infiltrating their domestic lives.",
        releaseDate: "2019-05-30",
        genre: "Thriller, Drama",
        rating: 8.5,
        imdbId: "tt6751668",
        director: "Bong Joon Ho",
        isDeleted: false
    },
    {
        id: "3",
        title: "The Dark Knight",
        description: "Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
        releaseDate: "2008-07-18",
        genre: "Action, Crime, Drama",
        rating: 9.0,
        imdbId: "tt0468569",
        director: "Christopher Nolan",
        isDeleted: false
    },
    {
        id: "4",
        title: "Whiplash",
        description: "A young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an abusive instructor.",
        releaseDate: "2014-10-10",
        genre: "Drama, Music",
        rating: 8.5,
        imdbId: "tt2582802",
        director: "Damien Chazelle",
        isDeleted: false
    },
    {
        id: "5",
        title: "Interstellar",
        description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        releaseDate: "2014-11-07",
        genre: "Adventure, Drama, Sci-Fi",
        rating: 8.6,
        imdbId: "tt0816692",
        director: "Christopher Nolan",
        isDeleted: false
    }
];

const movies = [...mockMovies];

export const createMovie = async (movie: Movie): Promise<Movie> => {
    const id = (movies.length + 1).toString();
    const newMovie = {
        ...movie,
        id,
        isDeleted: false
    };

    movies.push(newMovie);
    return newMovie;
};

export const getAllMovies = async (): Promise<Movie[]> => {
    return movies.filter(movie => !movie.isDeleted);
};

export const getMovieById = async (id: string): Promise<Movie> => {
    const movie = movies.find(movie => movie.id === id);
    if (!movie || movie.isDeleted) {
        throw new NotFoundError('Movie not found');
    }
    return movie;
};

export const updateMovie = async (id: string, movie: Movie): Promise<Movie> => {
    const index = movies.findIndex(m => m.id === id);
    if (index === -1 || movies[index].isDeleted) {
        throw new NotFoundError('Movie not found');
    }

    const updatedMovie = { 
        ...movie,
        id,
        isDeleted: false
    };
    
    movies[index] = updatedMovie;
    return updatedMovie;
};

export const deleteMovie = async (id: string, force: boolean = false): Promise<boolean> => {
    const index = movies.findIndex(m => m.id === id);
    if (index === -1) {
        throw new NotFoundError('Movie not found');
    }

    if (force) {
        movies.splice(index, 1);
    } else {
        movies[index] = { ...movies[index], isDeleted: true };
    }

    return true;
};
