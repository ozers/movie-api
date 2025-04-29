import {CreateMovie, Movie, UpdateMovie} from '../models/movie.model';
import { NotFoundError } from '../utils/errors';
import { MovieModel } from '../models/movie.mongoose';
import { createCacheService } from './cache.service';

// Filmler için 15 dakikalık önbellek süresi
const movieCache = createCacheService('movie', 900);

export const createMovie = async (request: CreateMovie): Promise<Movie> => {
    const newMovie = new MovieModel({
        ...request,
        isDeleted: false
    });

    const savedMovie = await newMovie.save();
    
    const movieObject = savedMovie.toObject();
    
    const movieDto = {
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
    
    // yeni filmi all cache içine ekle (eğer cache varsa)
    const allMovies = await movieCache.get<Movie[]>('all');
    if (allMovies) {
        // varolan cache'e yeni filmi ekle ve tekrar cache'le
        allMovies.push(movieDto);
        await movieCache.set('all', allMovies);
    }
    
    return movieDto;
};

export const getAllMovies = async (): Promise<Movie[]> => {
    return await movieCache.wrap('all', async () => {
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
    });
};

export const getMovieById = async (id: string): Promise<Movie> => {
    // önce movie:id:[UUID] cache kontrol et
    const cachedMovie = await movieCache.get<Movie>(`id:${id}`);
    if (cachedMovie) {
        return cachedMovie;
    }
    
    // movie:all cache kontrol et ve varsa oradan filtrele
    const allMovies = await movieCache.get<Movie[]>('all');
    if (allMovies) {
        const movie = allMovies.find(m => m.id === id && !m.isDeleted);
        if (movie) {
            // filmi bulursan ID bazlı cache'e de yaz (lazy caching)
            await movieCache.set(`id:${id}`, movie);
            return movie;
        }
    }

    // hiç cache yoksa veya bulunamadıysa, db'den çek
    return await movieCache.wrap(`id:${id}`, async () => {
        // ve cache'e ekle
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
    });
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
    
    // güncellenmiş film objesini oluştur
    const m = updatedMovie.toObject();
    const movieDto = {
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
    
    // ID bazlı cache'i güncelle
    await movieCache.set(`id:${id}`, movieDto);
    
    // all cache'indeki filmi güncelle (eğer cache varsa)
    const allMovies = await movieCache.get<Movie[]>('all');
    if (allMovies) {
        // filmi güncelle
        const updatedMovies = allMovies.map(m => {
            if (m.id === id) {
                return movieDto;
            }
            return m;
        });
        await movieCache.set('all', updatedMovies);
    }
    
    return movieDto;
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

    // ID bazlı cache'i temizle
    await movieCache.delete(`id:${id}`);
    
    // all cache'inden silinen filmi çıkar (eğer cache varsa)
    const allMovies = await movieCache.get<Movie[]>('all');
    if (allMovies) {
        // silinen filmi cache'den tamamen kaldır
        const filteredMovies = allMovies.filter(m => m.id !== id);
        await movieCache.set('all', filteredMovies);
    }

    return true;
};
