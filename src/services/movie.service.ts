import {CreateMovie, Movie, UpdateMovie} from '../models/movie.model';
import { NotFoundError } from '../utils/errors';
import { MovieModel } from '../models/movie.mongoose';

export const createMovie = async (request: CreateMovie): Promise<Movie> => {
    const newMovie = new MovieModel({
        ...request,
        isDeleted: false
    });

    const savedMovie = await newMovie.save();
    
    const movieObject = savedMovie.toObject();
    
    return {
        id: movieObject._id,
        title: movieObject.title,
        description: movieObject.description,
        releaseDate: movieObject.releaseDate,
        genre: movieObject.genre,
        rating: movieObject.rating,
        imdbId: movieObject.imdbId,
        director: movieObject.director,
        isDeleted: movieObject.isDeleted
    };
};

export const getAllMovies = async (): Promise<Movie[]> => {
    const movieList = await MovieModel.find({ isDeleted: false });
    
    return movieList.map(movie => {
        const m = movie.toObject();
        return {
            id: m._id,
            title: m.title,
            description: m.description,
            releaseDate: m.releaseDate,
            genre: m.genre,
            rating: m.rating,
            imdbId: m.imdbId,
            director: m.director,
            isDeleted: m.isDeleted
        };
    });
};

export const getMovieById = async (id: string): Promise<Movie> => {
    const movie = await MovieModel.findById(id);
    if (!movie || movie.isDeleted) {
        throw new NotFoundError('Movie not found');
    }
    
    const m = movie.toObject();
    return {
        id: m._id,
        title: m.title,
        description: m.description,
        releaseDate: m.releaseDate,
        genre: m.genre,
        rating: m.rating,
        imdbId: m.imdbId,
        director: m.director,
        isDeleted: m.isDeleted
    };
};

export const updateMovie = async (id: string, body: UpdateMovie): Promise<Movie> => {
    if (!id) {
        throw new NotFoundError('Movie ID is required');
    }
    
    const movie = await MovieModel.findById(id);
    if (!movie || movie.isDeleted) {
        throw new NotFoundError('Movie not found');
    }

    Object.assign(movie, body);
    movie.isDeleted = false;
    
    const updatedMovie = await movie.save();
    
    const m = updatedMovie.toObject();
    return {
        id: m._id,
        title: m.title,
        description: m.description,
        releaseDate: m.releaseDate,
        genre: m.genre,
        rating: m.rating,
        imdbId: m.imdbId,
        director: m.director,
        isDeleted: m.isDeleted
    };
};

export const deleteMovie = async (id: string, force: boolean = false): Promise<boolean> => {
    const movie = await MovieModel.findById(id);
    if (!movie) {
        throw new NotFoundError('Movie not found');
    }

    if (force) {
        await MovieModel.deleteOne({ _id: id });
    } else {
        movie.isDeleted = true;
        await movie.save();
    }

    return true;
};
