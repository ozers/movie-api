import 'dotenv/config';
import connectDB from '../config/mongoose.config';
import { MovieModel } from '../models/movie.mongoose';
import { DirectorModel } from '../models/director.mongoose';

const seedMovies = [
    {
        title: "Inception",
        description: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.",
        releaseDate: new Date("2010-07-16"),
        genre: "Action, Sci-Fi",
        rating: 8.8,
        imdbId: "tt1375666",
        director: "Christopher Nolan",
        isDeleted: false
    },
    {
        title: "Parasite",
        description: "A poor family schemes to become employed by a wealthy household by infiltrating their domestic lives.",
        releaseDate: new Date("2019-05-30"),
        genre: "Thriller, Drama",
        rating: 8.5,
        imdbId: "tt6751668",
        director: "Bong Joon Ho",
        isDeleted: false
    },
    {
        title: "The Dark Knight",
        description: "Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
        releaseDate: new Date("2008-07-18"),
        genre: "Action, Crime, Drama",
        rating: 9.0,
        imdbId: "tt0468569",
        director: "Christopher Nolan",
        isDeleted: false
    },
    {
        title: "Whiplash",
        description: "A young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an abusive instructor.",
        releaseDate: new Date("2014-10-10"),
        genre: "Drama, Music",
        rating: 8.5,
        imdbId: "tt2582802",
        director: "Damien Chazelle",
        isDeleted: false
    },
    {
        title: "Interstellar",
        description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        releaseDate: new Date("2014-11-07"),
        genre: "Adventure, Drama, Sci-Fi",
        rating: 8.6,
        imdbId: "tt0816692",
        director: "Christopher Nolan",
        isDeleted: false
    }
];

const seedDirectors = [
    {
        firstName: 'Christopher',
        lastName: 'Nolan',
        birthDate: '1970-07-30',
        bio: 'Christopher Nolan is a British-American filmmaker known for his complex narratives, philosophical themes, and practical effects.',
        isDeleted: false
    },
    {
        firstName: 'Bong',
        lastName: 'Joon-ho',
        birthDate: '1969-09-14',
        bio: 'Bong Joon-ho is a South Korean film director, producer and screenwriter known for his emphasis on social themes and genre-mixing.',
        isDeleted: false
    },
    {
        firstName: 'Damien',
        lastName: 'Chazelle',
        birthDate: '1985-01-19',
        bio: 'Damien Chazelle is an American director and screenwriter known for his musical films and his unique cinematic style.',
        isDeleted: false
    }
];

const seed = async () => {
    try {
        // MongoDB'ye bağlan
        await connectDB();
        
        // Mevcut verileri temizle
        await MovieModel.deleteMany({});
        await DirectorModel.deleteMany({});
        console.log('Mevcut film ve yönetmen verileri temizlendi');
        
        // Seed verileri ekle
        const directors = await DirectorModel.insertMany(seedDirectors);
        console.log(`${directors.length} yönetmen eklendi`);
        
        const movies = await MovieModel.insertMany(seedMovies);
        console.log(`${movies.length} film eklendi`);
        
        console.log('Veritabanı başarıyla dolduruldu!');
        process.exit(0);
    } catch (error) {
        console.error('Veritabanı doldurma hatası:', error);
        process.exit(1);
    }
};

// Seed fonksiyonunu çalıştır
seed(); 